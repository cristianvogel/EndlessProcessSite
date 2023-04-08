import { get, derived, writable, type Writable } from 'svelte/store';
import type {
	StereoSignal,
	AudioEngineStatus,
	Signal,
	RawAudioBuffer,
	SamplerOptions
} from 'src/typeDeclarations';
import { samplesPlayer, smoothMute, stereoOut } from '$lib/audio/AudioFunctions';
import { CablesPatch, Playlist, RawAudioBufferStore } from '$lib/stores/stores';
import WebRenderer from '@elemaudio/web-renderer';
import type { NodeRepr_t } from '@elemaudio/core';

// OOPS/TS Singleton design pattern.

class AudioEngine {
	#core: WebRenderer | null;
	_AudioEngineStatus: Writable<AudioEngineStatus>;
	_contextIsRunning: Writable<boolean>;
	_elemLoaded: Writable<boolean>;
	_audioContext: Writable<AudioContext>;
	_endNodes: Writable<any>;
	_masterVolume: Writable<number | Signal>;
	DEFAULT_VFS_PATH: string;

	constructor() {
		this.#core = null;
		this._masterVolume = writable(1); // default master volume
		this.DEFAULT_VFS_PATH = get(Playlist).VFS_PREFIX;
		this._AudioEngineStatus = writable('loading');
		this._contextIsRunning = writable(false);
		this._elemLoaded = writable(false);
		this._audioContext = writable();
		this._endNodes = writable({ elem: null, cables: null });
		this.DEFAULT_VFS_PATH = '/VFS/EndProc/Playlist/';
	}

	/**
	 * @description Initialise the Elementary audio engine asynchronously
	 * and store it in the Audio singleton as a static property
	 * called Audio.elemEndNode
	 */
	async init(ctx?: AudioContext): Promise<void> {
		Audio.#core = new WebRenderer();

		// Choose a context to use
		if (ctx) {
			Audio.actx = ctx;
			console.log('Passing existing AudioContext', Audio.actx);
		} else {
			console.log('No context!');
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
		Audio.routeToCables(Audio.elemEndNode);

		/* ---- Callbacks ----------------- */

		// BaseAudioContext state change callback
		Audio.actx.addEventListener('statechange', Audio._stateChangeHandler);

		// Elementary load callback
		Audio.#core.on('load', async () => {
			console.log('Elementary loaded 🔊?', Audio.elemLoaded);
		});

		// Elementary error reporting
		Audio.#core.on('error', function (e) {
			console.error(e);

			if (typeof e === 'string' && e.includes('Failed to find resource')) {
				console.warn('Failed to find VFS resource..trying again');
				Audio.#core?.updateVirtualFileSystem(get(RawAudioBufferStore).body);
			}
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
	_stateChangeHandler = () => {
		Audio._contextIsRunning.update(() => {
			return Audio.actx.state === 'running';
		});
		Audio._AudioEngineStatus.update(() => {
			return Audio.baseState;
		});
	};

	/*---- Implementated Methods  ------------------------------*/
	/**
	 * @description Connect a node to the BaseAudioContext destination
	 */
	connectToDestination(node: AudioNode) {
		node.connect(Audio.actx.destination);
	}

	/**
	 *  @description Routing the Elementary graph into the Cables.gl visualiser
	 */
	routeToCables(node: AudioNode) {
		const merge = new ChannelMergerNode(Audio.actx, { numberOfInputs: 1 });
		Audio.elemEndNode.connect(merge);
		const gain = new GainNode(Audio.actx, { gain: 10 }); // boost the send into Cables visualiser
		get(CablesPatch).getVar('CablesAnalyzerNodeInput').setValue(merge.connect(gain));
		Audio.connectToDestination(merge);
	}

	/**
	 * @description Elementary Audio WebRenderer uses a virtual file system to reference audio files.
	 * https://www.elementary.audio/docs/packages/web-renderer#virtual-file-system
	 */
	async updateVFS(rawAudioBuffer: RawAudioBuffer) {
		// Update the virtual file system using data loaded from the +page.ts load() function
		// and eventually from the Playlist store when that is done
		let vfsDictionaryEntry;
		this.decodeRawBuffer(rawAudioBuffer).then(([decoded, vfsPath]) => {
			vfsDictionaryEntry = {
				[`${vfsPath}`]: decoded?.getChannelData(0)
			};
			Audio.#core?.updateVirtualFileSystem(vfsDictionaryEntry);
		});
	}

	/**
	 * @description Decodes the raw audio buffer into an AudioBuffer, asynchonously with guards
	 */
	async decodeRawBuffer(rawAudioBuffer: RawAudioBuffer): Promise<[AudioBuffer | null, string]> {
		const { body, header } = rawAudioBuffer;
		let decoded: AudioBuffer | null = null;
		// we need audio context in order to decode the audio data
		while (!Audio.actx || !body) {
			await new Promise((resolve) => setTimeout(resolve, 100));
		}
		try {
			decoded = await Audio.actx.decodeAudioData(body as ArrayBuffer);
		} catch (error) {
			console.log(new Error('Raw data was not decoded'));
			decoded = Audio.actx?.createBuffer(1, 1, 44100);
		} finally {
			const { vfsPath } = header;
			console.log('Decoded audio with length ', decoded?.getChannelData(0).length, ' to ', vfsPath);
		}
		return [decoded, header.vfsPath];
	}

	/**
	 * @description Wraps the Elementary core Render function
	 */
	render(stereoSignal: StereoSignal): void {
		if (!Audio.#core || !stereoSignal) return;
		const final = stereoOut(stereoSignal);
		Audio.#core.render(final.left, final.right);
	}

	/**
	 * @description: Plays samples from a VFS path, with options
	 */
	playFromVFS(props: SamplerOptions) {
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
	 * @description
	 * Mute Elementary's final gain node and but keep the audio context running
	 * , send a Mute message to Cables patch
	 */
	pauseAudioEngine(pauseCables: boolean = false): void {
		console.log('pausing audio engine');
		Audio.render(smoothMute());
		if (pauseCables) Audio.pauseCables('pause');
		Audio.status = 'paused';
	}

	/**
	 * Unmute aka 'Play'
	 */
	unmute(): void {
		console.log('un-muting audio engine');
		// try to resume the context if it's suspended
		if (Audio.status === 'suspended' || 'closed') {
			Audio.resumeContext();
		}
		Audio.status = 'playing';
		const { header } = get(RawAudioBufferStore);
		Audio.playFromVFS({ vfsPath: header.vfsPath });

		// Audio.runFFT();
	}

	pauseCables(state: 'pause' | 'resume'): void {
		// todo: pause or resume Cables patch
	}

	suspend(): void {
		Audio.actx.suspend().then(() => {
			console.log('🔇 audiocontext suspended');
		});
	}

	suspendAfterMs(ms: number = 100): void {
		new Promise((res) => setTimeout(res, ms)).then(() => {
			smoothMute();
			Audio.suspend();
		});
	}

	/*---- Getters and Setters --------------------------------*/
	get stores() {
		return {
			audioStatus: Audio._AudioEngineStatus,
			isRunning: Audio._contextIsRunning,
			actx: Audio._audioContext,
			endNodes: Audio._endNodes,
			masterVolume: Audio._masterVolume
		};
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
		return get(Audio.contextAndStatus).status;
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

export const Audio: AudioEngine = new AudioEngine();

