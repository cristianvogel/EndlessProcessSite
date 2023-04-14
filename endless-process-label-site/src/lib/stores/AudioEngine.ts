import { get, derived, writable, type Writable } from 'svelte/store';
import type {
	StereoSignal,
	AudioEngineStatus,
	Signal,
	RawAudioBuffer,
	SamplerOptions
} from 'src/typeDeclarations';

import { samplesPlayer, stereoOut, bufferProgress } from '$lib/audio/AudioFunctions';
import { channelExtensionFor } from '$lib/classes/Utils';
import { CablesPatch, VFS_PATH_PREFIX, Playlist, Decoding, Scrubbing } from '$lib/stores/stores';
import WebRenderer from '@elemaudio/web-renderer';
import type { NodeRepr_t } from '@elemaudio/core';
import { el } from '@elemaudio/core';

// OOPS/TS Singleton design pattern.
// todo: set a sample rate constant prop

class AudioEngine {
	#core: WebRenderer | null;
	#silentCore: WebRenderer | null;
	static #instance: AudioEngine | null;
	private _AudioEngineStatus: Writable<AudioEngineStatus>;
	private _contextIsRunning: Writable<boolean>;
	private _elemLoaded: Writable<boolean>;
	private _audioContext: Writable<AudioContext>;
	private _endNodes: Writable<any>;
	private _masterVolume: Writable<number | Signal>;
	private _currentTrackName: string;
	private _currentVFSPath: string;
	private _currentTrackDurationSeconds: number;
	private _scrubbing: boolean;

	static getInstance() {
		if (!AudioEngine.#instance) {
			AudioEngine.#instance = new AudioEngine();
		}
		return AudioEngine.#instance;
	}

	private constructor() {
		if (!AudioEngine.#instance) {
			AudioEngine.#instance = this;
		}

		this.#core = this.#silentCore = null;
		this._masterVolume = writable(1); // default master volume
		this._AudioEngineStatus = writable('loading');
		this._contextIsRunning = writable(false);
		this._elemLoaded = writable(false);
		this._audioContext = writable();
		this._endNodes = writable({ mainCore: null, silentCore: null });
		// dynamically set from store subscriptions
		this._currentVFSPath = '';
		this._currentTrackName = '';
		this._currentTrackDurationSeconds = 0;
		this._scrubbing = false;
	}

	subscribeToStores() {
		/**
		 * @description
		 *  Subscribers to update AudioEngine with current track info
		 */
		Playlist.subscribe(($Playlist) => (Audio._currentTrackName = $Playlist.currentTrack.name));

		Playlist.subscribe(
			($Playlist) => (Audio._currentVFSPath = get(VFS_PATH_PREFIX) + $Playlist.currentTrack.name)
		);

		Playlist.subscribe(
			($Playlist) =>
				(Audio._currentTrackDurationSeconds = $Playlist.currentTrack.duration
					? $Playlist.currentTrack.duration
					: 0)
		);

		Scrubbing.subscribe(($Scrubbing) => {
			Audio._scrubbing = $Scrubbing;
		});
	}

	cleanup() {
		Audio.suspend();
	}

	/**
	 * @description Initialise the Elementary audio engine asynchronously
	 * and store it in the Audio singleton as a static property
	 * called Audio.elemEndNode
	 */
	async init(ctx?: AudioContext): Promise<void> {
		/**
		 * @description Came up with the idea of using a second WebRenderer instance
		 * to handle  audio rate 'control' signals and emit side effects, without
		 * hitting the hardware outputs. Monitoring for impact hit on performance, but
		 * seems to be fine so far. Calling this 'Two-Webrenderers-and-a-microphone'
		 * pattern '💿💿🎤'
		 */
		Audio.#core = new WebRenderer();
		Audio.#silentCore = new WebRenderer();

		// Subscribe to Svelte stores outside of component
		Audio.subscribeToStores();

		// Choose a context to use
		if (ctx) {
			Audio.actx = ctx;
			console.log('Passing existing AudioContext');
		} else {
			console.log('No context!');
			Audio.cleanup();
		}

		// Elementary connecting promise : Silent Core
		Audio.elemSilentNode = await Audio.#silentCore
			.initialize(Audio.actx, {
				numberOfInputs: 1,
				numberOfOutputs: 1,
				outputChannelCount: [2]
			})
			.then((node) => {
				console.log('Silent Core loaded');
				return node;
			});

		// Elementary connecting promise : Main Core
		Audio.elemEndNode = await Audio.#core
			.initialize(Audio.actx, {
				numberOfInputs: 1,
				numberOfOutputs: 1,
				outputChannelCount: [2]
			})
			.then((node) => {
				Audio._elemLoaded.set(true);
				return node;
			});

		Audio.routeToCables();
		Audio.connectToDestination(Audio.elemEndNode); // connect the Elem end node to the destination

		/* ---- Event Driven Callbacks ----------------- */

		// BaseAudioContext state change callback
		Audio.actx.addEventListener('statechange', Audio.stateChangeHandler);

		// Elementary load callback
		Audio.#core.on('load', async () => {
			console.log('Elementary loaded 🔊?', Audio.elemLoaded);
			Audio.currentVFSPath += `${Audio._currentTrackName}`;
		});

		// Elementary error reporting
		Audio.#core.on('error', function (e) {
			console.error('🔇 ', e);
			Audio.cleanup();
		});

		// Elementary FFT callback
		Audio.#core.on('fft', function (e) {
			// do something with the FFT data
			console.count('fft');
		});

		// Elementary meter callback
		Audio.#core.on('meter', function (e) {
			// do something with the meter data
			console.count('meter');
		});

		// Elementary snapshot callback
		Audio.#silentCore.on('snapshot', function (e) {
			console.log('progress report -> ', e.data as number);
			Playlist.update(($playlist) => {
				$playlist.currentTrack.progress = e.data as number;
				return $playlist;
			});
		});
	}

	/*---- Callback handlers ------------------------------*/
	private stateChangeHandler = () => {
		Audio._contextIsRunning.update(() => {
			return Audio.actx.state === 'running';
		});
		Audio._AudioEngineStatus.update(() => {
			return Audio.baseState;
		});
	};

	/*---- Implementations  ------------------------------*/
	/**
	 * @description Connect a node to the BaseAudioContext destination
	 */
	connectToDestination(node: AudioNode) {
		node.connect(Audio.actx.destination);
	}

	/**
	 *  @description Routing the Elementary graph into the Cables.gl visualiser
	 */
	routeToCables() {
		const cablesSend = new GainNode(Audio.actx, { gain: 10 }); // boost the send into Cables visualiser, never heard
		Audio.elemEndNode.connect(cablesSend);
		get(CablesPatch).getVar('CablesAnalyzerNodeInput').setValue(cablesSend);
	}

	/**
	 * @description Elementary Audio WebRenderer uses a virtual file system to reference audio files.
	 * https://www.elementary.audio/docs/packages/web-renderer#virtual-file-system
	 * Update the virtual file system using data loaded from the +page.ts load() function
		todo: better typing for vfsDictionaryEntry
	 */
	async updateVFS(rawAudioBuffer: RawAudioBuffer) {
		let vfsDictionaryEntry: any;

		this.decodeRawBuffer(rawAudioBuffer).then(([decoded, vfsPath]) => {
			if (!decoded) {
				console.warn('Decoding skipped.');
				return;
			}
			// adds a channel extension to the path for each channel, the extension starts at 1 (not 0)
			for (let i = 0; i < decoded.numberOfChannels; i++) {
				vfsDictionaryEntry = {
					...vfsDictionaryEntry,
					[`${vfsPath}${channelExtensionFor(i + 1)}`]: decoded.getChannelData(i)
				};
			}
			console.log('vfsDictionaryEntry', vfsDictionaryEntry);
			Audio.#core?.updateVirtualFileSystem(vfsDictionaryEntry);
		});
	}

	/**
	 * @description Decodes the raw audio buffer into an AudioBuffer, asynchonously with guards
	 */
	async decodeRawBuffer(rawAudioBuffer: RawAudioBuffer): Promise<[AudioBuffer | null, string]> {
		const stopwatch = Date.now();
		while (!rawAudioBuffer) await new Promise((resolve) => setTimeout(resolve, 100));
		const { body, header } = rawAudioBuffer;
		let decoded: AudioBuffer | null = null;
		// we need audio context in order to decode the audio data
		while (!Audio.actx || !body) {
			await new Promise((resolve) => setTimeout(resolve, 100));
		}
		try {
			decoded = await Audio.actx.decodeAudioData(body as ArrayBuffer);
		} catch (error) {
			console.log(new Error('Decoding skipped. Dummy buffer created.'));
			decoded = Audio.actx?.createBuffer(1, 1, 44100);
		} finally {
			const { vfsPath } = header;
			const bytes = decoded?.getChannelData(0).length;
			header.bytes = bytes || 0;
			console.log(
				'Decoded audio with length ',
				bytes,
				' to ',
				vfsPath,
				' in ',
				Date.now() - stopwatch,
				'ms'
			);
			Decoding.update(($d) => {
				$d.done = true;
				return $d;
			});
		}
		// update the DurationElement in the playlist container map
		if (decoded && decoded.duration > 1) {
			Playlist.update(($plist) => {
				// guard against the 1 samp skipped buffer hack above
				if (!decoded) return $plist;
				$plist.durations.set(header.name, decoded.duration);
				return $plist;
			});
		}
		return [decoded, header.vfsPath];
	}

	/**
	 * @description Wraps the Elementary core Render function
	 */
	render(stereoSignal: StereoSignal): void {
		if (!Audio.#core || !stereoSignal) return;
		Audio.status = 'playing';
		const final = stereoOut(stereoSignal);
		Audio.#core.render(final.left, final.right);
	}

	/**
	 * @description silent render of a control signal, for handling a signal with a side effect like the progress counter composite, which emits an event _and_ an audiorate signal
	 */
	controlRender(controlSignal: Signal): void {
		if (!Audio.#silentCore || !controlSignal) return;
		Audio.#silentCore.render(el.mul(controlSignal, 0));
	}

	/**
	 * @description: Plays samples from a VFS path, with options
	 */
	playFromVFS(props: SamplerOptions) {
		Audio.render(samplesPlayer(props));
		Audio.progressBar({
			run: props.trigger as number,
			startOffset: props.startOffset || 0
		});
	}

	/**
	 * @description: Render the progress counter composite and its callback sideeffect
	 */
	progressBar(props: { run: number; startOffset: number }) {
		let { run = 1, startOffset: startOffsetMs = 0 } = props;
		const totalDurMs = Audio.currentTrackDurationSeconds * 1000;

		Audio.controlRender(
			bufferProgress({
				key: Audio.currentVFSPath + '_progBar',
				totalDurMs,
				run,
				rate: 10,
				startOffset: startOffsetMs
			})
		);
	}

	/**
	 * @description: Tries to resume the base AudioContext
	 */
	resumeContext(): void {
		if (!Audio.actx) return;
		Audio.actx.resume().then(() => {
			console.log('AudioContext resume ⚙︎');
		});
	}

	/**
	 * Unmute aka 'Play'
	 */
	unmute(): void {
		// try to resume the context if it's suspended
		if (Audio.status === 'suspended') {
			Audio.resumeContext();
		}
		// gate the current track
		Audio.playFromVFS({
			vfsPath: Audio.currentVFSPath,
			trigger: 1
		});
	}

	/**
	 * @description
	 * Mute Elementary's final gain node and but keep the audio context running
	 * , send a Mute message to Cables patch
	 */
	mute(pauseCables: boolean = false): void {
		// release gate on the current track

		Audio.playFromVFS({
			vfsPath: Audio.currentVFSPath,
			trigger: 0
		});

		Audio.status = 'paused';
		if (pauseCables) Audio.pauseCables('pause');
	}

	// todo: pause or resume Cables patch
	pauseCables(state: 'pause' | 'resume'): void {}

	suspend(): void {
		Audio.actx.suspend().then(() => {
			console.log('🔇 audiocontext suspended');
		});
	}

	suspendAfterMs(ms: number = 100): void {
		new Promise((res) => setTimeout(res, ms)).then(() => {
			Audio.suspend();
		});
	}

	/*---- getters  --------------------------------*/
	get stores() {
		// todo: refactor these to Tan-Li Hau's subsciber pattern
		// https://www.youtube.com/watch?v=oiWgqk8zG18
		return {
			audioStatus: Audio._AudioEngineStatus,
			isRunning: Audio._contextIsRunning,
			actx: Audio._audioContext,
			endNodes: Audio._endNodes,
			masterVolume: Audio._masterVolume
		};
	}

	get scrubbing(): boolean {
		return Audio._scrubbing;
	}

	get currentTrackDurationSeconds(): number {
		return Audio._currentTrackDurationSeconds;
	}

	get currentVFSPath(): string {
		return Audio._currentVFSPath;
	}

	get audioBuffersReady(): boolean {
		return typeof Audio._currentTrackName === 'string';
	}
	get currentTrackName(): string {
		return Audio._currentTrackName;
	}

	get masterVolume(): number | NodeRepr_t {
		return get(Audio._masterVolume);
	}

	get contextAndStatus() {
		return derived([Audio._audioContext, Audio._AudioEngineStatus], ([$audioContext, $status]) => {
			return { context: $audioContext, status: $status };
		});
	}

	get actx() {
		return get(Audio.contextAndStatus).context;
	}

	get status() {
		console.log('get status', get(Audio._AudioEngineStatus));
		return get(Audio._AudioEngineStatus);
	}

	get elemLoaded() {
		return get(Audio._elemLoaded);
	}

	get isRunning(): boolean {
		return get(Audio._contextIsRunning);
	}

	get isMuted(): boolean {
		return Audio.status !== ('playing' || 'running') || !Audio.isRunning;
	}

	get elemSilentNode() {
		return get(Audio._endNodes).silentCore;
	}

	get elemEndNode() {
		return get(Audio._endNodes).mainCore;
	}

	get baseState(): AudioEngineStatus {
		return Audio.actx.state as AudioEngineStatus;
	}
	/*---- setters --------------------------------*/

	set currentVFSPath(path: string) {
		console.log('set currentVFSPath', path);
		Playlist.update(($plist) => {
			$plist.currentTrack.path = path;
			return $plist;
		});
	}

	set currentTrackName(name: string) {
		Playlist.update(($plist) => {
			$plist.currentTrack.name = name;
			return $plist;
		});
	}

	set masterVolume(normLevel: number | NodeRepr_t) {
		Audio._masterVolume.update(() => normLevel);
	}

	set actx(newCtx: AudioContext) {
		Audio._audioContext.update(() => newCtx);
	}

	set status(newStatus: AudioEngineStatus) {
		Audio._AudioEngineStatus.update(() => newStatus);
	}
	set elemSilentNode(node: AudioNode) {
		Audio._endNodes.update((n) => {
			n.silentCore = node;
			return n;
		});
	}

	set elemEndNode(node: AudioNode) {
		Audio._endNodes.update((n) => {
			n.mainCore = node;
			return n;
		});
	}
}

export const Audio: AudioEngine = AudioEngine.getInstance();

