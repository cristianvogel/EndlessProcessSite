import { get, derived, writable, type Writable } from 'svelte/store';
import type {
	StereoSignal,
	MainAudioStatus,
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

export class MainAudioClass {
	_core: WebAudioRenderer;
	_silentCore: WebAudioRenderer;
	_MainAudioStatus: Writable<MainAudioStatus>;
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
		this._MainAudioStatus = writable('loading');
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
		if (!AudioMain.actx && ctx) {
			AudioMain.actx = ctx;
			console.log('Passing existing AudioContext', ctx);
		} else if (!ctx && !AudioMain.actx) {
			AudioMain.actx = new AudioContext();
			console.warn('No AudioContext passed. Creating new one.');
		}

		// ok, add listener for base AudioContext state changes
		AudioMain.actx.addEventListener('statechange', AudioMain.stateChangeHandler);

		// initialise the named WebAudioRenderer instance and connect 
		// it's end node according to user options
		get(EndNodes)
			.set(renderer.id,
				await AudioMain._core
					.initialize(AudioMain.actx, {
						numberOfInputs: 1,
						numberOfOutputs: 1,
						outputChannelCount: [2]
					})
					.then((node) => {
						switch (true) {
							case options?.connectTo?.destination: {
								AudioMain.connectToDestination(node);
							}
							case options?.connectTo?.visualiser: {
								AudioMain.connectToVisualiser(node);
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
		AudioMain.registerCallbacksFor(renderer, extraFunctionality);
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
			ContextSampleRate.set(AudioMain.actx.sampleRate)
			ForceAudioContextResume.update(($f) => { $f = AudioMain.resumeContext; return $f });
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
		node.connect(AudioMain.actx.destination);
	}

	/**
	 * @name connectToMusic
	 * @description connect a node to the input of the MainAudio WebAudioRenderer 
	 * which handles the music playback
	 */
	connectToMusic(node: AudioNode) {
		node.connect(AudioMain.endNodes.get('music') as AudioNode);
	}

	/**
	 * @name connectToVisualiser
	 * @description Routing the MainAudio WebAudioRenderer into the Cables.gl visualiser
	 */
	connectToVisualiser(node: AudioNode) {
		const cablesSend = new GainNode(AudioMain.actx, { gain: 10 }); // boost the send into Cables visualiser, never heard
		node.connect(cablesSend);
		get(CablesPatch).getVar('CablesAnalyzerNodeInput').setValue(cablesSend);
	}

	/**
	 * @name stateChangeHandler
	 * @description Callback when the base AudioContext state changes
	 */
	private stateChangeHandler = () => {
		AudioMain._contextIsRunning.update(() => {
			return AudioMain.actx.state === 'running';
		});
		AudioMain._MainAudioStatus.update(() => {
			return AudioMain.baseState;
		});
	};

	/**
	 * @name updateOutputLevelWith
	 * @description a useful Elem render call which will scale
	 * the main output level with the passed node. Useful for 
	 * premaster level, fades etc.
	 */
	updateOutputLevelWith(node: Signal): void {
		AudioMain.master(undefined, node);
	};

	/**
	* @name master
	* @description Master channel render.
    * Includes a stereo compressor, which is ducked by the Speech signal 
	* arriving at el.in({channel:0})
    * @param stereoSignal optional stereo signal to render through the Master. 
	* If passed, it is stored in the AudioMain._out buss updating whatever was patched before.
	* @param attenuator optional attenuator signal which will smoothly scale the signal just
	* before final output, which is hard coded to be smooth scaled by the overall master volume. 
	*/
	master(stereoSignal?: StereoSignal, attenuator?: Signal | number): void {
		if (!AudioMain._core) return;
		if (stereoSignal) {
			AudioMain._outputBuss = stereoSignal;
		} 
		const duckingCompressor = {
			left: el.compress(20, 160, -35, 90, el.in({ channel: 0 }), AudioMain._outputBuss.left),
			right: el.compress(20, 160, -35, 90, el.in({ channel: 0 }), AudioMain._outputBuss.right)
		}
		let master = attenuator ? attenuateStereo(duckingCompressor, attenuator) : duckingCompressor;
		master = attenuateStereo(master, AudioMain.masterVolume)
		const result = AudioMain._core.render(master.left, master.right);

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
		if (!AudioMain._silentCore || !controlSignal) return;
		AudioMain._silentCore.render(el.mul(controlSignal, 0));
	}

	/**
	 * @name playWithScrub
	 * @description: Plays samples from a VFS path, with scrubbing
	 */
	playWithScrub(props: SamplerOptions) {
		AudioMain.master(scrubbingSamplesPlayer(props));
		AudioMain.playProgressBar(props);
	}

	/**
	 * @name playProgressBar
	 * @description todo
	 */
	playProgressBar(props: SamplerOptions) {
		AudioMain.renderBufferProgress({
			key: AudioMain.currentTrackTitle,
			run: props.trigger as number,
			startOffset: props.startOffset || 0,
			totalDurMs: props.durationMs || AudioMain.currentTrackDurationSeconds * 1000
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

		AudioMain.controlRender(
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
		AudioMain.decodeRawBuffer(container).then((data) => {
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
		// while (!AudioMain.actx) {
		// 	await new Promise((resolve) => setTimeout(resolve, 50));
		// }
		try {
			decoded = await AudioMain.actx.decodeAudioData(body as ArrayBuffer);
		} catch (error) {
			console.warn('Decoding skipped ', error);
			decoded = AudioMain.actx?.createBuffer(1, 1, 44100);
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
		if (AudioMain.actx.state === 'suspended') {
			AudioMain.status = 'resuming';
			AudioMain.actx.resume().then(() => {
				console.log('AudioContext resumed ⚙︎');
				AudioMain.status = 'running';
			});
		}
	}

	/**
	 * @name unmute aka 'Play'
	 * @description Main way the music starts playing, from a user interaction.
	 */
	unmute(): void {
		// try to resume the context if it's suspended
		if (AudioMain.status === 'suspended') {
			AudioMain.resumeContext();
		}
		AudioMain.status = 'playing';
		AudioMain.playWithScrub({
			vfsPath: AudioMain.currentVFSPath,
			trigger: 1,
			durationMs: AudioMain.currentTrackDurationSeconds * 1000
		});
	}

	/**
	 * @name pause
	 * @description Stop sounding but keep the audio context running
	 * , send a Mute message to Cables patch
	 */
	pause(pauseCables: boolean = false): void {
		// release gate on the current track

		AudioMain.playWithScrub({
			vfsPath: AudioMain.currentVFSPath,
			trigger: 0,
			durationMs: AudioMain.currentTrackDurationSeconds * 1000
		});

		AudioMain.status = 'paused';
		if (pauseCables) AudioMain.pauseCables('pause');
	}

	// todo: pause or resume Cables patch
	pauseCables(state: 'pause' | 'resume'): void { }


	/*---- getters  --------------------------------*/
	get stores() {
		// todo: refactor these to Tan-Li Hau's subsciber pattern
		// https://www.youtube.com/watch?v=oiWgqk8zG18
		return {
			audioStatus: AudioMain._MainAudioStatus,
			isRunning: AudioMain._contextIsRunning,
			actx: AudioMain._audioContext,
			masterVolume: AudioMain._masterVolume
		};
	}

	get progress() {
		return AudioMain._currentMetadata?.progress || 0;
	}
	get sidechain() {
		return this._sidechain;
	}
	get scrubbing(): boolean {
		return AudioMain._scrubbing;
	}
	get currentTrackDurationSeconds(): number {
		return AudioMain._currentMetadata?.duration || -1;
	}
	get currentVFSPath(): string {
		return AudioMain._currentMetadata?.vfsPath || 'no VFS path';
	}
	get buffersReady(): boolean {
		return get(Decoded).done
	}
	get currentTrackTitle(): string {
		return AudioMain._currentMetadata?.title || '';
	}
	get masterVolume(): number | NodeRepr_t {
		return get(AudioMain._masterVolume);
	}
	get contextAndStatus() {
		return derived([AudioMain._audioContext, AudioMain._MainAudioStatus], ([$audioContext, $status]) => {
			return { context: $audioContext, status: $status };
		});
	}
	get actx() {
		return get(AudioMain.contextAndStatus).context;
	}
	get status() {
		console.log('get status', get(AudioMain._MainAudioStatus));
		return get(AudioMain._MainAudioStatus);
	}
	get elemLoaded() {
		return get(MusicCoreLoaded);
	}
	get isRunning(): boolean {
		return get(AudioMain._contextIsRunning);
	}
	get isMuted(): boolean {
		return AudioMain.status !== ('playing' || 'running') || !AudioMain.isRunning;
	}

	get endNodes(): Map<string, AudioNode> {
		return AudioMain._endNodes;	
	}

	get baseState(): MainAudioStatus {
		return AudioMain.actx.state as MainAudioStatus;
	}

	/*---- setters --------------------------------*/

	set progress(newProgress: number) {
		if (!newProgress) return;
		AudioMain._currentMetadata = { ...AudioMain._currentMetadata, progress: newProgress };
	}
	set masterVolume(normLevel: number | NodeRepr_t) {
		AudioMain._masterVolume.update(() => normLevel);
	}
	set actx(newCtx: AudioContext) {
		AudioMain._audioContext.update(() => newCtx);
	}
	set status(newStatus: MainAudioStatus) {
		AudioMain._MainAudioStatus.update(() => newStatus);
	}
}

export const AudioMain = new MainAudioClass();

