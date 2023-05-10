import { get, derived, writable, type Writable } from 'svelte/store';
import type {
	StereoSignal,
	AudioCoreStatus,
	Signal,
	SamplerOptions,
	StructuredAssetContainer,
	AssetMetadata
} from '../../typeDeclarations';

import { scrubbingSamplesPlayer, bufferProgress, attenuateStereo, hannEnvelope } from '$lib/audio/AudioFunctions';
import { channelExtensionFor } from '$lib/classes/Utils';
import {
	CablesPatch,
	PlaylistMusic,
	Scrubbing,
	OutputMeters,
	MusicCoreLoaded,
	VFS_PATH_PREFIX,
	Decoded,
	ContextSampleRate,
	ForceAudioContextResume,
	MusicAssetsReady
} from '$lib/stores/stores';
import WebRenderer from '@elemaudio/web-renderer';
import type { NodeRepr_t } from '@elemaudio/core';
import { el } from '@elemaudio/core';


// ════════╡ Music WebRenderer Core ╞═══════
// todo: set a sample rate constant prop

export class AudioCore {
	_core: WebRenderer;
	_silentCore: WebRenderer;
	_AudioCoreStatus: Writable<AudioCoreStatus>;
	_contextIsRunning: Writable<boolean>;
	_audioContext: Writable<AudioContext>;
	_endNodes: Writable<any>;
	_masterVolume: Writable<number | Signal>;
	_currentMetadata: AssetMetadata | undefined;
	_scrubbing: boolean;
	_sidechain: number | Signal;
	_outputBuss: StereoSignal
	_assetsReady: boolean;

	constructor() {
		this._core = this._silentCore = null as unknown as WebRenderer;;
		this._masterVolume = writable(0.909); // default master volume
		this._AudioCoreStatus = writable('loading');
		this._contextIsRunning = writable(false);
		this._audioContext = writable();
		this._endNodes = writable({
			mainCore: null,
			silentCore: null
		});
		this._outputBuss = { left: 0 as unknown as Signal, right: 0 as unknown as Signal };

		// these below are dynamically set from store subscriptions
		this._currentMetadata = { title: '', vfsPath: '', duration: 0, progress: 0 };
		this._scrubbing = false;
		this._assetsReady = false;
		this._sidechain = 0
	}

	/**
	 * @description
	*  Subscribers that update the Audio class 's internal state from outside
	 */
	subscribeToStores() {

		MusicAssetsReady.subscribe(($ready) => {
			Audio._assetsReady = $ready;
		});
		PlaylistMusic.subscribe(($p) => {
			Audio._currentMetadata = $p.currentTrack;
		});
		Scrubbing.subscribe(($scrubbing) => {
			Audio._scrubbing = $scrubbing;
		});
		OutputMeters.subscribe(($meters) => {
			if (!Audio._core) return;
			Audio._sidechain = el.sm($meters.SpeechAudible as number) as Signal;
		});
	}

	/**
	 * @description Initialise the main WebRenderer instances handling the music 
	 *  and store in AudioCore class as this._endNodes
	 */
	async init(ctx?: AudioContext): Promise<void> {

		// this is the one AudioContext to reference throughout
		if (ctx) {
			Audio.actx = ctx;
			console.log('Passing existing AudioContext', ctx);
			ContextSampleRate.set(Audio.actx.sampleRate)
		} else {
			console.log('No context!');
		}

		// Elementary Node : Main Core
		Audio._core = new WebRenderer();
		Audio.elemEndNode = await Audio._core
			.initialize(Audio.actx, {
				numberOfInputs: 1,
				numberOfOutputs: 1,
				outputChannelCount: [2]
			})
			.then((node) => {
				return node;
			});


		/**
		 * @info The 'silent core' signal computer creates a second 
		 * WebRenderer instance to compute at audio rate
		 * and emit event based on results, without the 
		 * unwanted side effect of outputting DC to speakers 
		 */
		Audio._silentCore = new WebRenderer();
		Audio.elemSilentNode = await Audio._silentCore
			.initialize(Audio.actx, {
				numberOfInputs: 1,
				numberOfOutputs: 1,
				outputChannelCount: [2]
			})
			.then((node) => {
				return node;
			});

		// connect the Main Core only to the hardware output
		Audio.routeToCables();
		Audio.connectToDestination(Audio.elemEndNode);

		/* ---- Event Driven Callbacks ----------------- */

		Audio.actx.addEventListener('statechange', Audio.stateChangeHandler);

		Audio._core.on('load', () => {
			Audio.subscribeToStores();
			// now we are sure Elementary is ready
			ForceAudioContextResume.update(($f) => { $f = Audio.resumeContext; return $f });
			console.log('Main core loaded 🔊')
		});

		Audio._silentCore.on('load', () => {
			MusicCoreLoaded.set(true)
			console.log('Silent core loaded');
		});

		Audio._core.on('error', function (e) {
			console.error('🔇 ', e);
		});

		Audio._silentCore.on('error', function (e) {
			console.error('🔇 ', e);
		});

		Audio._core.on('fft', function (e) {
			// do something with the FFT data
			console.count('fft');
		});

		Audio._core.on('meter', function (e) {
			console.log('meter received in main core ', e.max);
			OutputMeters.update(($o) => {
				$o = { ...$o, MusicAudible: e.max }
				return $o;
			})
		});

		Audio._silentCore.on('snapshot', function (e) {
			PlaylistMusic.update(($pl) => {
				if (!$pl.currentTrack || !e.data) return $pl;
				$pl.currentTrack.progress = e.data as number;
				return $pl;
			});
			// use snapshot event to update the progress of the windowing envelope
			Audio.updateOutputLevelWith(hannEnvelope(Audio.progress));
		});
	}

	/**
	 * @name connectToDestination
	 * @description Connect a node to the BaseAudioContext hardware destination
	  */
	connectToDestination(node: AudioNode) {
		node.connect(Audio.actx.destination);
	}

	/**
	 * @name connectToMain
	 * @description connect a node to the input of the AudioCore WebRenderer 
	 * which handles the music playback
	 */
	connectToMain(node: AudioNode) {
		node.connect(Audio.elemEndNode);
	}

	/**
	 * @name routeToCables
	 * @description Routing the AudioCore WebRenderer into the Cables.gl visualiser
	 */
	routeToCables() {
		const cablesSend = new GainNode(Audio.actx, { gain: 10 }); // boost the send into Cables visualiser, never heard
		Audio.elemEndNode.connect(cablesSend);
		get(CablesPatch).getVar('CablesAnalyzerNodeInput').setValue(cablesSend);
	}

	private stateChangeHandler = () => {
		Audio._contextIsRunning.update(() => {
			return Audio.actx.state === 'running';
		});
		Audio._AudioCoreStatus.update(() => {
			return Audio.baseState;
		});
	};

	/**
	 * @name updateOutputLevelWith
	 * @description a useful Elem render call which will scale
	 * the main output level with the passed node. Useful for 
	 * premaster level, fades etc.
	 */
	updateOutputLevelWith(node: Signal): void {
		Audio.master(undefined, node);
	};

	/**
	* @name master
	* @description Master channel render.
    * Includes a stereo compressor, which is ducked by the Speech signal 
	* arriving at el.in({channel:0})
    * @param stereoSignal optional stereo signal to render through the Master. 
	* If passed, it is stored in the Audio._out buss updating whatever was patched before.
	* @param attenuator optional attenuator signal which will smoothly scale the signal just
	* before final output, which is hard coded to be smooth scaled by the overall master volume. 
	*/
	master(stereoSignal?: StereoSignal, attenuator?: Signal | number): void {
		if (!Audio._core) return;
		if (stereoSignal) {
			Audio._outputBuss = stereoSignal;
		} 
		const duckingCompressor = {
			left: el.compress(20, 160, -35, 90, el.in({ channel: 0 }), Audio._outputBuss.left),
			right: el.compress(20, 160, -35, 90, el.in({ channel: 0 }), Audio._outputBuss.right)
		}
		let master = attenuator ? attenuateStereo(duckingCompressor, attenuator) : duckingCompressor;
		master = attenuateStereo(master, Audio.masterVolume)
		const result = Audio._core.render(master.left, master.right);

		//console.log('Render graph ፨ ', result);
	}

	/**
	 * @name controlRender
	 * @description silent render of a control signal using the secondary 'silent core' WebRenderer,
	 * for rendering a signal with a side effect. For example the play progress counter, 
	 * which emits an event _and_ an audiorate signal, which we don't want to hear as it will likely 
	 * cause DC offset.
	 */
	controlRender(controlSignal: Signal): void {
		if (!Audio._silentCore || !controlSignal) return;
		Audio._silentCore.render(el.mul(controlSignal, 0));
	}

	/**
	 * @name playWithScrub
	 * @description: Plays samples from a VFS path, with scrubbing
	 */
	playWithScrub(props: SamplerOptions) {
		Audio.master(scrubbingSamplesPlayer(props));
		Audio.playProgressBar(props);
	}

	/**
	 * @name playProgressBar
	 * @description todo
	 */
	playProgressBar(props: SamplerOptions) {
		Audio.renderBufferProgress({
			key: Audio.currentTrackTitle,
			run: props.trigger as number,
			startOffset: props.startOffset || 0,
			totalDurMs: props.durationMs || Audio.currentTrackDurationSeconds * 1000
		});
	}

	/**
	 * @name renderBufferProgress
	 * @description: Renders the progress counter and its callback side effect
	 */
	renderBufferProgress(props: { run: number, startOffset: number, key?: string, totalDurMs: number }) {
		let {
			run = 1,
			startOffset = 0,
			key,
			totalDurMs,
		} = props;

		Audio.controlRender(
			bufferProgress({
				key,
				totalDurMs,
				run,
				updateInterval: 10,
				startOffset
			})
		);
	}

	/**
	 * @name updateVFS
	 * @description Elementary Audio WebRenderer uses a virtual file system to reference audio files.
	 * https://www.elementary.audio/docs/packages/web-renderer#virtual-file-system
	 * Update the virtual file system using data loaded from a load() function.
	 * @param container
	 * header and body ArrayBufferContainer - will be decoded to audio buffer for VFS use
	 * @param playlistStore
	 * a Writable that holds titles and other data derived from the buffers
	 * @param core
	 * the Elementary core which will register and use the VFS dictionary entry.
	 * 🚨 Guard against race conditions by only updating the VFS when the core is loaded.
	 */

	async updateVFS(
		container: StructuredAssetContainer,
		core: WebRenderer
	) {
		// decoder
		Audio.decodeRawBuffer(container).then((data) => {
			let { decodedBuffer: decoded, title } = data;
			if (!decoded || decoded.length < 16) {
				console.warn('Decoding skipped.');
				return;
			}
			// adds a channel extension, starts at 1 (not 0)
			for (let i = 0; i < decoded.numberOfChannels; i++) {
				const vfsKey = get(VFS_PATH_PREFIX) + title + channelExtensionFor(i + 1);
				const vfsDictionaryEntry =
				{
					[vfsKey]: decoded.getChannelData(i)
				};
				core.updateVirtualFileSystem(vfsDictionaryEntry);
			}
			// update the DurationElement in the playlist container map
			PlaylistMusic.update(($plist) => {
				if (!decoded) return $plist;
				if (!$plist.durations) return $plist;
				$plist.durations.set(title as string, decoded.duration);
				return $plist;
			});
		});
	}

	/**
	 * @name decodeRawBuffer
	 * @description Decodes a raw array buffer using AudioContext into an AudioBuffer, 
	 * asynchonously with guards.
	 */
	async decodeRawBuffer(container: StructuredAssetContainer): Promise<{ title: string, vfsPath: string, decodedBuffer: AudioBuffer }> {
		while (!container) await new Promise((resolve) => setTimeout(resolve, 100));
		const { body, header } = container;
		let decoded: AudioBuffer | null = null;
		// while (!Audio.actx) {
		// 	await new Promise((resolve) => setTimeout(resolve, 50));
		// }
		try {
			decoded = await Audio.actx.decodeAudioData(body as ArrayBuffer);
		} catch (error) {
			console.warn('Decoding skipped ', error);
			decoded = Audio.actx?.createBuffer(1, 1, 44100);
		} finally {
			header.bytes = decoded?.getChannelData(0).length || 0;
		}
		return {
			title: header.title as string,
			vfsPath: header.vfsPath as string,
			decodedBuffer: decoded
		};
	}

	/**
	 * @name resumeContext
	 * @description Tries to resume the base AudioContext
	 * this should only be called once, after a user interaction
	 */
	resumeContext(): void {
		if (Audio.actx.state === 'suspended') {
			Audio.status = 'resuming';
			Audio.actx.resume().then(() => {
				console.log('AudioContext resumed ⚙︎');
				Audio.status = 'running';
			});
		}
	}

	/**
	 * @name unmute aka 'Play'
	 * @description Main way the music starts playing, from a user interaction.
	 */
	unmute(): void {
		// try to resume the context if it's suspended
		if (Audio.status === 'suspended') {
			Audio.resumeContext();
		}
		Audio.status = 'playing';
		Audio.playWithScrub({
			vfsPath: Audio.currentVFSPath,
			trigger: 1,
			durationMs: Audio.currentTrackDurationSeconds * 1000
		});
	}

	/**
	 * @name pause
	 * @description Stop sounding but keep the audio context running
	 * , send a Mute message to Cables patch
	 */
	pause(pauseCables: boolean = false): void {
		// release gate on the current track

		Audio.playWithScrub({
			vfsPath: Audio.currentVFSPath,
			trigger: 0,
			durationMs: Audio.currentTrackDurationSeconds * 1000
		});

		Audio.status = 'paused';
		if (pauseCables) Audio.pauseCables('pause');
	}

	// todo: pause or resume Cables patch
	pauseCables(state: 'pause' | 'resume'): void { }


	/*---- getters  --------------------------------*/
	get stores() {
		// todo: refactor these to Tan-Li Hau's subsciber pattern
		// https://www.youtube.com/watch?v=oiWgqk8zG18
		return {
			audioStatus: Audio._AudioCoreStatus,
			isRunning: Audio._contextIsRunning,
			actx: Audio._audioContext,
			endNodes: Audio._endNodes,
			masterVolume: Audio._masterVolume
		};
	}

	get progress() {
		return Audio._currentMetadata?.progress || 0;
	}
	get sidechain() {
		return this._sidechain;
	}
	get scrubbing(): boolean {
		return Audio._scrubbing;
	}
	get currentTrackDurationSeconds(): number {
		return Audio._currentMetadata?.duration || -1;
	}
	get currentVFSPath(): string {
		return Audio._currentMetadata?.vfsPath || 'no VFS path';
	}
	get buffersReady(): boolean {
		return get(Decoded).done
	}
	get currentTrackTitle(): string {
		return Audio._currentMetadata?.title || '';
	}
	get masterVolume(): number | NodeRepr_t {
		return get(Audio._masterVolume);
	}
	get contextAndStatus() {
		return derived([Audio._audioContext, Audio._AudioCoreStatus], ([$audioContext, $status]) => {
			return { context: $audioContext, status: $status };
		});
	}
	get actx() {
		return get(Audio.contextAndStatus).context;
	}
	get status() {
		console.log('get status', get(Audio._AudioCoreStatus));
		return get(Audio._AudioCoreStatus);
	}
	get elemLoaded() {
		return get(MusicCoreLoaded);
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
	get baseState(): AudioCoreStatus {
		return Audio.actx.state as AudioCoreStatus;
	}

	/*---- setters --------------------------------*/

	set progress(newProgress: number) {
		if (!newProgress) return;
		Audio._currentMetadata = { ...Audio._currentMetadata, progress: newProgress };
	}
	set masterVolume(normLevel: number | NodeRepr_t) {
		Audio._masterVolume.update(() => normLevel);
	}
	set actx(newCtx: AudioContext) {
		Audio._audioContext.update(() => newCtx);
	}
	set status(newStatus: AudioCoreStatus) {
		Audio._AudioCoreStatus.update(() => newStatus);
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

export const Audio = new AudioCore();

