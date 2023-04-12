import { get, derived, writable, type Writable } from 'svelte/store';
import type {
	StereoSignal,
	AudioEngineStatus,
	Signal,
	RawAudioBuffer,
	SamplerOptions
} from 'src/typeDeclarations';

import { samplesPlayer, stereoOut } from '$lib/audio/AudioFunctions';
import { channelExtensionFor } from '$lib/classes/Utils';
import { CablesPatch, VFS_PATH_PREFIX, Playlist, Decoding } from '$lib/stores/stores';
import WebRenderer from '@elemaudio/web-renderer';
import type { NodeRepr_t } from '@elemaudio/core';
import { el } from '@elemaudio/core';

// OOPS/TS Singleton design pattern.

class AudioEngine {
	#core: WebRenderer | null;
	static #instance: AudioEngine | null;
	private _AudioEngineStatus: Writable<AudioEngineStatus>;
	private _contextIsRunning: Writable<boolean>;
	private _elemLoaded: Writable<boolean>;
	private _audioContext: Writable<AudioContext>;
	private _endNodes: Writable<any>;
	private _masterVolume: Writable<number | Signal>;
	private _currentTrackName: string;
	private _currentVFSPath: string;

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

		this.#core = null;
		this._masterVolume = writable(1); // default master volume
		this._AudioEngineStatus = writable('loading');
		this._contextIsRunning = writable(false);
		this._elemLoaded = writable(false);
		this._audioContext = writable();
		this._endNodes = writable({ elem: null, cables: null });
		this._currentVFSPath = '';
		this._currentTrackName = '';
	}

	subscribeToStores() {
		Playlist.subscribe(($Playlist) => (Audio._currentTrackName = $Playlist.currentTrack.name));
		Playlist.subscribe(
			($Playlist) => (Audio._currentVFSPath = get(VFS_PATH_PREFIX) + $Playlist.currentTrack.name)
		);
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
		Audio.subscribeToStores();
		Audio.#core = new WebRenderer();

		// Choose a context to use
		if (ctx) {
			Audio.actx = ctx;
			console.log('Passing existing AudioContext');
		} else {
			console.log('No context!');
			Audio.cleanup();
		}

		// Elementary connecting promise
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

		/* ---- Callbacks ----------------- */

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
			if (e.source === 'cables') {
				console.log(e.max);
			}
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
			//console.info('VFS entry: ', vfsDictionaryEntry);
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
			console.log(
				'Decoded audio with length ',
				decoded?.getChannelData(0).length,
				' to ',
				vfsPath,
				' in ',
				Date.now() - stopwatch,
				'ms'
			);
			Decoding.update((d) => {
				d.done = true;
				return d;
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
	 * @description: Plays samples from a VFS path, with options
	 */
	playFromVFS(props: SamplerOptions) {
		//
		// mute caller props .... {
		// 	vfsPath: Audio.currentVFSPath,
		// 	trigger: 0
		// }
		Audio.render(samplesPlayer(props));
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
		if (Audio.status === 'suspended' || 'closed') {
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

	get cablesEndNode() {
		return get(Audio._endNodes).cables;
	}

	get elemEndNode() {
		return get(Audio._endNodes).elem;
	}

	get baseState(): AudioEngineStatus {
		return Audio.actx.state as AudioEngineStatus;
	}
	/*---- setters --------------------------------*/

	set currentVFSPath(path: string) {
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
	set cablesEndNode(node: AudioNode) {
		Audio._endNodes.update((n) => {
			n.cables = node;
			return n;
		});
	}

	set elemEndNode(node: AudioNode) {
		Audio._endNodes.update((n) => {
			n.elem = node;
			return n;
		});
	}
}

export const Audio: AudioEngine = AudioEngine.getInstance();

