import { get, derived, writable, type Writable } from 'svelte/store';
import type {
	StereoSignal,
	AudioCoreStatus,
	Signal,
	SamplerOptions,
	StructuredAssetContainer,
	AssetMetadata,
	NamedWebAudioRenderer,
	WebAudioRendererInitOptions,
	RawFFT,
	Functionality
} from '../../typeDeclarations';

import { scrubbingSamplesPlayer, bufferProgress, attenuateStereo } from '$lib/audio/AudioFunctions';
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
	MusicAssetsReady,
	EndNodes
} from '$lib/stores/stores';
import WebAudioRenderer from '@elemaudio/web-renderer';
import type { NodeRepr_t } from '@elemaudio/core';
import { el } from '@elemaudio/core';
import { customEvents } from '$lib/audio/EventHandlers';

// ════════╡ Music WebAudioRenderer Core ╞═══════

export class AudioCore {
	_core: WebAudioRenderer;
	_silentCore: WebAudioRenderer;
	_AudioCoreStatus: Writable<AudioCoreStatus>;
	_contextIsRunning: Writable<boolean>;
	_audioContext: Writable<AudioContext>;
	_endNodes: Map<string, AudioNode>;
	_masterVolume: Writable<number | Signal>;
	_currentMetadata: AssetMetadata | undefined;
	_scrubbing: boolean;
	_sidechain: number | Signal;
	_outputBuss: StereoSignal
	_assetsReady: boolean;

	constructor() {
		this._core = new WebAudioRenderer()
		this._silentCore = new WebAudioRenderer();
		this._masterVolume = writable(0.909); // default master volume
		this._AudioCoreStatus = writable('loading');
		this._contextIsRunning = writable(false);
		this._audioContext = writable();
		this._outputBuss = { left: 0 as unknown as Signal, right: 0 as unknown as Signal };

		// these below are dynamically set from store subscriptions
		this._endNodes = get(EndNodes);
		this._currentMetadata = get(PlaylistMusic).currentTrack;
		this._scrubbing = get(Scrubbing);
		this._assetsReady = get(MusicAssetsReady);
		this._sidechain = el.sm(0) as Signal;
		this.subscribeToStores();
	}

	/**
	 * @description
	*  Subscribers that update the Audio class 's internal state from outside
	 */
	subscribeToStores() {
		EndNodes.subscribe((endNodes) => {
			endNodes.forEach((node, key) => {
				this._endNodes.set(key, node);
			})
		})
		MusicAssetsReady.subscribe(($ready) => {
			this._assetsReady = $ready;
		});
		PlaylistMusic.subscribe(($p) => {
			this._currentMetadata = $p.currentTrack;
		});
		Scrubbing.subscribe(($scrubbing) => {
			this._scrubbing = $scrubbing;
		});
		OutputMeters.subscribe(($meters) => {
			if (!this._core) return;
			this._sidechain = el.sm($meters.SpeechAudible as number) as Signal;
		});
	}

	async init(renderer: NamedWebAudioRenderer, ctx?: AudioContext, options?: WebAudioRendererInitOptions): Promise<void> {
		// first, there should only be one base AudioContext throughout the app
		if (!Audio.actx && ctx) {
			Audio.actx = ctx;
			console.log('Passing existing AudioContext', ctx);
		} else if (!ctx && !Audio.actx) {
			Audio.actx = new AudioContext();
			console.warn('No AudioContext passed. Creating new one.');
		}

		// ok, add listener for base AudioContext state changes
		Audio.actx.addEventListener('statechange', Audio.stateChangeHandler);

		// initialise the named WebAudioRenderer instance and connect 
		// it's end node according to user options
		get(EndNodes)
			.set(renderer.id,
				await Audio._core
					.initialize(Audio.actx, {
						numberOfInputs: 1,
						numberOfOutputs: 1,
						outputChannelCount: [2]
					})
					.then((node) => {
						switch (true) {
							case options?.connectTo?.destination: {
								Audio.connectToDestination(node);
							}
							case options?.connectTo?.visualiser: {
								Audio.connectToVisualiser(node);
							}
							default: {
								// connect to nothing
								break;
							}
						}
						return node
					})
			);

		// add any extra features for a specific
		// named renderer here, as custom event handlers then
		// register them all
		let extraFunctionality = options?.extraFunctionality || {};
		const progress: Functionality = customEvents.progressSignal
		if (renderer.id === 'silent') {
			extraFunctionality = { ...extraFunctionality, progress }
		}
		Audio.registerCallbacksFor(renderer, extraFunctionality);
		EndNodes.update((_nodesDict) => {
			_nodesDict.set(renderer.id, renderer.renderer);
			return _nodesDict;
		})
		// done
		return Promise.resolve();
	}

	registerCallbacksFor(namedRenderer: NamedWebAudioRenderer, customEventHandlers?: any) {
		const { id, renderer } = namedRenderer;
		renderer.on('load', () => {
			ContextSampleRate.set(Audio.actx.sampleRate)
			ForceAudioContextResume.update(($f) => { $f = Audio.resumeContext; return $f });
			console.log(`${id} loaded 🔊`)
		});
		renderer.on('error', function (e: unknown) {
			console.error(`🔇 ${id} -> Error from core`);
		});
		renderer.on('fft', function (fft: RawFFT) {
			// do something with the FFT data
			console.count(`${id} fft data`);
		});

		if (customEventHandlers) {
			Object.keys(customEventHandlers).forEach((key) => {
				renderer.on(key, customEventHandlers[key]);
			});
		}
	}

	/**
	 * @name connectToDestination
	 * @description Connect a node to the BaseAudioContext hardware destination aka speakers
	  */
	connectToDestination(node: AudioNode) {
		node.connect(Audio.actx.destination);
	}

	/**
	 * @name connectToMusic
	 * @description connect a node to the input of the AudioCore WebAudioRenderer 
	 * which handles the music playback
	 */
	connectToMusic(node: AudioNode) {
		node.connect(Audio.endNodes.get('music') as AudioNode);
	}

	/**
	 * @name connectToVisualiser
	 * @description Routing the AudioCore WebAudioRenderer into the Cables.gl visualiser
	 */
	connectToVisualiser(node: AudioNode) {
		const cablesSend = new GainNode(Audio.actx, { gain: 10 }); // boost the send into Cables visualiser, never heard
		node.connect(cablesSend);
		get(CablesPatch).getVar('CablesAnalyzerNodeInput').setValue(cablesSend);
	}

	/**
	 * @name stateChangeHandler
	 * @description Callback when the base AudioContext state changes
	 */
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
	 * @description silent render of a control signal using the secondary 'silent core' WebAudioRenderer,
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
	 * @name updateVFStoCore
	 * @description Elementary Audio Renderers use a virtual file system to reference audio * files in memory.
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

	async updateVFStoCore(
		container: StructuredAssetContainer,
		core: WebAudioRenderer
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
				console.log('Will update VFS with ', vfsDictionaryEntry, ' to core ', core)
			//	core.updateVirtualFileSystem(vfsDictionaryEntry);
			}
			// update the DurationElement in the playlist store Map
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

	get endNodes(): Map<string, AudioNode> {
		return Audio._endNodes;	
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
}

export const Audio = new AudioCore();

