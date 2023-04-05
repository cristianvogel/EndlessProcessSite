import { get, derived, writable, type Writable } from 'svelte/store';
import type { StereoSignal, AudioEngineStatus } from 'src/typeDeclarations';
import { el, type NodeRepr_t } from '@elemaudio/core';
import { detunedSaws } from '$lib/audio/synths';
import { CablesPatch } from '$lib/stores/stores';
import WebRenderer from '@elemaudio/web-renderer';

// Store as OOPS/TS Singleton design pattern. Reference https://javascript.plainenglish.io/writing-a-svelte-store-with-typescript-22fa1c901a4

class AudioEngine {
	#core: WebRenderer | null;
	masterVolume: number | NodeRepr_t;

	constructor(
		zeroDC: NodeRepr_t = el.const({ value: 0 }),
		private _AudioEngineStatus: Writable<AudioEngineStatus> = writable('loading'),
		private _contextIsRunning: Writable<boolean> = writable(false),
		private _elemLoaded: Writable<boolean> = writable(false),
		private _audioContext: Writable<AudioContext> = writable(),
		private _endNodes: Writable<any> = writable({ elem: null, cables: null }),
		public elemStereoOut: Writable<StereoSignal> = writable({
			left: zeroDC,
			right: zeroDC
		}),
		public DEFAULT_VFS_PATH: string = '/vfs/ENDPROC/defaultAudio.wav'
	) {
		this.#core = null;
		this.masterVolume = 1;
	}

	get stores() {
		return {
			audioStatus: this._AudioEngineStatus,
			isRunning: this._contextIsRunning,
			actx: this._audioContext,
			endNodes: this._endNodes,
			stereoOutSignal: this.elemStereoOut
		};
	}

	// Initialise the Elementary audio engine
	async init(ctx?: AudioContext): Promise<void> {
		Audio.#core = new WebRenderer();

		// Choose a context to use
		if (ctx) {
			Audio.actx = ctx;
			console.log('Passing existing AudioContext', Audio.actx);
		} else {
			// Audio.actx = new AudioContext();
			console.log('No context!');
		}

		// BaseAudioContext state change callback
		this.actx.addEventListener('statechange', Audio._stateChangeHandler);

		// Elementary load callback
		Audio.#core.on('load', async () => {
			console.log('Elementary loaded 🔊?', Audio.elemLoaded);
		});
		// Elementary error reporting
		Audio.#core.on('error', function (e) {
			console.error(e);
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

		// Elementary connecting promise
		this.elemEndNode = await Audio.#core
			.initialize(Audio.actx, {
				numberOfInputs: 1,
				numberOfOutputs: 1,
				outputChannelCount: [2]
			})
			.then((node) => {
				this._elemLoaded.set(true);
				return node;
			});
		this.routeToCables(this.elemEndNode);
	}

	connectToDestination(node: AudioNode) {
		node.connect(this.actx.destination);
	}

	routeToCables(node: AudioNode) {
		const merge = new ChannelMergerNode(this.actx, { numberOfInputs: 1 });
		Audio.elemEndNode.connect(merge);
		get(CablesPatch).getVar('CablesAnalyzerNodeInput').setValue(merge);
		this.connectToDestination(merge);
		console.log('Elem routed to CablesAnalyzer');
	}

	async updateVFS(samples: ArrayBuffer, vfsPath: string = Audio.DEFAULT_VFS_PATH) {
		// Update the virtual file system only when the audio context is ready
		let sampleBuffer;
		try {
			sampleBuffer = await Audio.actx?.decodeAudioData(samples);
		} catch (error) {
			throw new Error('SampleBuffer data is not available');
		} finally {
			console.log(
				'actx converted sampleBuffer with length ',
				sampleBuffer?.getChannelData(0).length
			);
		}
		const vfsDictionary = {
			[vfsPath]: sampleBuffer?.getChannelData(0)
		};
		Audio.#core?.updateVirtualFileSystem(vfsDictionary);
	}

	vfsSamplePlay(options: {
		vfsPath?: string;
		trigger?: NodeRepr_t | number;
		rate?: NodeRepr_t | number;
	}) {
		let { vfsPath: path, trigger = 1, rate = 1 } = options;
		if (!path || path.length < 1) path = Audio.DEFAULT_VFS_PATH;
		Audio.renderChannels({
			left: el.sample({ path: path, channel: 0 }, trigger, rate),
			right: el.sample({ path: path, channel: 0 }, trigger, rate)
		});
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
	// todo: differenciate between playing and running, its getting confusing
	// the Audiocontext RUNS but it might not be PLAYING anything
	get isPlaying(): boolean {
		return get(Audio._contextIsRunning);
	}

	get isMuted(): boolean {
		return !get(Audio._contextIsRunning);
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

	get stereoOut(): StereoSignal {
		// Elementary's stereo output signals
		return get(this.elemStereoOut);
	}

	set stereoOut({ left, right }: { left: NodeRepr_t; right: NodeRepr_t }) {
		this.elemStereoOut.update(() => ({ left, right }));
	}

	set actx(newCtx: AudioContext) {
		this._audioContext.update(() => newCtx);
	}

	set status(newStatus: AudioEngineStatus) {
		this._AudioEngineStatus.update(() => newStatus);
	}
	set cablesEndNode(node: AudioNode) {
		this._endNodes.update((n) => {
			n.cables = node;
			return n;
		});
	}

	set elemEndNode(node: AudioNode) {
		this._endNodes.update((n) => {
			n.elem = node;
			return n;
		});
	}

	_stateChangeHandler = () => {
		Audio._contextIsRunning.update(() => {
			return Audio.actx.state === 'running';
		});
		Audio._AudioEngineStatus.update(() => {
			return Audio.baseState;
		});
	};

	resumeContext(): void {
		Audio.actx.resume().then(() => {
			console.log('AudioContext is ', Audio.status);
		});
	}

	/**
	 * Just render a signal, no side effects
	 */
	render(signal: NodeRepr_t | null): void {
		if (!Audio.#core || !signal) return;
		Audio.#core.render(signal);
	}

	/**
	 * Render DC Blocked signals as left and right output signals
	 */
	renderChannels(channels: StereoSignal): void {
		if (CABLES.WEBAUDIO.getAudioContext() !== Audio.actx) {
			Audio.actx = CABLES.WEBAUDIO._audioContext = Audio.actx;
		}
		Audio.stereoOut = { left: el.dcblock(channels.left), right: el.dcblock(channels.right) };
		Audio.#core?.render(
			el.mul(el.sm(Audio.masterVolume), Audio.stereoOut.left),
			el.mul(el.sm(Audio.masterVolume), Audio.stereoOut.right)
		);
	}

	runFFT(): void {
		// not working yet
		console.log('running fft');
		if (Audio.isPlaying) {
			Audio.render(el.fft({ name: 'elFFT', key: 'fft' }, Audio.stereoOut.left));
		}
	}

	testTone(): void {
		console.log('test tone');
		Audio.renderChannels({
			left: el.cycle(460),
			right: el.cycle(463)
		});
	}
	/**
	 * A demo synth with four oscillators in stereo
	 */
	demoSynth(): void {
		Audio.renderChannels({
			left: detunedSaws({ ampMod: el.cycle(1 / 3) }, el.const({ key: 'L1', value: 60 })),
			right: detunedSaws({ ampMod: el.cycle(0.5) }, el.const({ key: 'R1', value: 90 }))
		});
	}

	/**
	 * Mute Elementary's final gain node and suspend the audio context
	 * optionally, send a Mute message to Cables patch
	 */
	pauseAudioEngine(pauseCables: boolean = false): void {
		console.log('pausing audio engine');
		Audio.renderChannels({
			left: el.sm(0),
			right: el.sm(0)
		});
		if (pauseCables) Audio.pauseCables('pause');
		Audio.status = 'paused';
	}

	// todo: decide what to play when unmuted action
	unmute(): void {
		console.log('un-muting audio engine');
		Audio.status = 'playing';
		Audio.vfsSamplePlay({});
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
			Audio.renderChannels({ left: el.sm(0), right: el.sm(0) });
			Audio.suspend();
		});
	}
}

export const Audio: AudioEngine = new AudioEngine();
