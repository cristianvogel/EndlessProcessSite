import { derived, get, writable, type Writable } from 'svelte/store';
import type {
	StereoSignal,
	MainAudioStatus,
	Signal,
	AssetMetadata,
	NamedWebAudioRenderer,
	RendererInitialisationProps,
	StructuredAssetContainer,
	SamplerOptions,
	RendererIdentifiers,
	ExtendedWebRenderer
} from '../../typeDeclarations';

import { scrubbingSamplesPlayer, bufferProgress, attenuateStereo, driftingSamplesPlayer } from '$lib/audio/AudioFunctions';
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
import { el, type NodeRepr_t } from '@elemaudio/core';



// ════════╡ Music WebAudioRenderer Core ╞═══════

export class MainAudioClass {
	_renderers: Map<RendererIdentifiers, ExtendedWebRenderer>;
	_MainAudioStatus: Writable<MainAudioStatus>;
	_contextIsRunning: Writable<boolean>;
	_audioContext: Writable<AudioContext>;
	_endNodes: Map<string, AudioNode>;
	_masterVolume: Writable<number | Signal>;
	_currentTrackMetadata: AssetMetadata;
	_currentSpeechMetadata: AssetMetadata;
	_scrubbing: boolean;
	_sidechain: number | Signal;
	_masterBuss: StereoSignal
	_assetsReady: boolean;
	_voiceVolume: number | Signal;

	constructor() {
		this._masterVolume = writable(0.808); // default master volume
		this._voiceVolume = 0.727;
		this._MainAudioStatus = writable('loading');
		this._contextIsRunning = writable(false);
		this._audioContext = writable();
		this._masterBuss = { left: 0 as unknown as Signal, right: 0 as unknown as Signal };
		this._renderers = new Map()
			.set('music', new WebAudioRenderer())
			.set('silent', new WebAudioRenderer()) // rename to control...?
			.set('speech', new WebAudioRenderer());

		// these here below are dynamically set from store subscriptions
		this._endNodes = get(EndNodes) as Map<string, AudioNode>;
		this._currentTrackMetadata = get(PlaylistMusic).currentTrack as AssetMetadata;
		this._currentSpeechMetadata = get(PlaylistMusic).currentChapter as AssetMetadata;
		this._scrubbing = get(Scrubbing) as boolean;
		this._assetsReady = get(MusicAssetsReady) as boolean;
		this._sidechain = el.sm(0) as Signal;
		this.subscribeToStores();
	}

	/**
	* @description
	*  Subscribers that update the Audio class 's internal state from outside
	*  as this is not a Svelte component
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
			this._currentTrackMetadata = $p.currentTrack as AssetMetadata;
			this._currentSpeechMetadata = $p.currentChapter as AssetMetadata;
		});
		Scrubbing.subscribe(($scrubbing) => {
			this._scrubbing = $scrubbing;
		});
		OutputMeters.subscribe(($meters) => {
			this._sidechain = el.sm($meters.SpeechAudible as number) as Signal;
		});
	}

	/**
	@name initialiseRenderer
	@description 
	● instantiate a named renderer
	● set routing 
	● register event driven expressions
	@param {AudioContext} ctx 
	@param {NamedWebAudioRenderer} namedRenderer
	@param {RendererInitialisationProps} props 
	@returns {Promise<void>}  could be used to report init errors...not implemented yet
	@exampleCall
		  await AudioMain.initialiseRenderer({
				namedRenderer: { id:'music', renderer: AudioMain._core }, 
				ctx: $CablesAudioContext,
				options: {
					connectTo: {
						destination: true,
						visualiser: true,
					},
				}
			});
	Example above would:
	● initialise a WebRenderer instance identifed as 'music'
	● store inside the Audio class as a property called _core
	● route to the main output destination and to a visualiser

	@exampleCall
		await AudioMain.initialiseRenderer({
			namedRenderer: { id:'silent', renderer: AudioMain._silentCore }, 
			ctx: $CablesAudioContext,
			options: {
				connectTo: {
					nothing: true,
				},
				eventExpressions: eventExpressions.get('silent')
			}
		});
	Example above would:
	● initialise a WebRenderer instance identifed as 'silent'
	● store inside the Audio class as a property called _silentCore
	● route to nothing
	● register any audio event listeners defined in an EventExpressionsForNamedRenderer
	*/
	async initialiseRenderer(props: RendererInitialisationProps): Promise<void> {
		const { namedRenderer, ctx, options = {} } = props;
		const { connectTo, eventExpressions } = options;

		// first, there should only be one base AudioContext throughout the app
		if (!AudioMain.actx && ctx?.sampleRate) {
			AudioMain.actx = ctx;
		} else if (!ctx && !AudioMain.actx) {
			AudioMain.actx = new AudioContext();
			console.warn('No AudioContext passed. Creating new one.');
		}
		console.log('Using AudioContext ', AudioMain.actx.sampleRate, AudioMain.actx.state);

		// set the sample rate for the app
		ContextSampleRate.set(AudioMain.actx.sampleRate)

		// initialise the named WebAudioRenderer instance 
		const { renderer, id } = namedRenderer;
		console.log('initialising renderer ', id)
		const endNode = await renderer
			.initialize(AudioMain.actx, {
				numberOfInputs: 1,
				numberOfOutputs: 1,
				outputChannelCount: [2]
			}).then((node: AudioNode) => { return node })


		// set routing
		console.groupCollapsed('Routing for:', id)
		if (connectTo) {
			if (connectTo.destination) {
				console.log('✅ destination')
				AudioMain.connectToDestination(endNode);
			}
			if (connectTo.visualiser) {
				console.log('✅ visualiser')
				AudioMain.connectToVisualiser(endNode)
			}
			if (connectTo.sidechain) {
				console.log('✅ sidechain')
				AudioMain.connectToSidechain(endNode)
			} else {
				console.log('⟤ connecting to nothing')
			}
		}; console.groupEnd();

		// extend renderer with custom id property
		Object.defineProperty(renderer, 'id', { value: id, writable: false });

		// extend renderer with custom Master Output Buss
		const newMasterBuss: StereoSignal = { left: 0 as unknown as Signal, right: 0 as unknown as Signal };
		Object.defineProperty(renderer, 'masterBuss', { value: newMasterBuss, writable: true });

		// add any extra functionality for a 
		// named renderer as event handlers then
		// register them with the renderer
		AudioMain.registerCallbacksFor({ renderer: renderer, id: id }, eventExpressions);

		// ok, add listener for base AudioContext state changes
		AudioMain.actx.addEventListener('statechange', AudioMain.stateChangeHandler);

		// update the EndNodes store a reference to the last node of the initialised 
		// renderer for further routing
		EndNodes.update((_nodesDict) => {
			_nodesDict.set(id, endNode);
			return _nodesDict;
		})

		// store the renderer in the AudioMain Map
		AudioMain._renderers.set(id, renderer);

		// done
		return Promise.resolve();
	}

	registerCallbacksFor(namedRenderer: NamedWebAudioRenderer, eventExpressions?: any) {
		const { renderer } = namedRenderer;
		// fires when the renderer is ready, returns 
		// some info about the renderer
		renderer.on('load', () => {
			ForceAudioContextResume.update(($f) => { $f = resumeContext; return $f });
			console.log(`${renderer.id} loaded 🔊`)
		});

		// error reporting from the WASM module
		renderer.on('error', function (e: unknown) {
			console.error(`🔇 ${renderer.id} -> Error`);
			console.groupCollapsed('Error details ▶︎');
			console.log(e)
			console.groupEnd();
		});

		// any audio Event-Driven functionality can be added
		// emitted by el.snapshot, el.meter etc
		if (eventExpressions) {
			console.group('Adding Audio Event Expressions to', renderer.id)
			Object.keys(eventExpressions).forEach((name: string) => {
				const event = { name, expression: eventExpressions[name] }
				console.log(` ╠ ${event.name} -> ${event.expression}`)
				renderer.on(event.name, event.expression);
			});
			console.groupEnd();
		};
	}

	/**
	 * @name connectToDestination
	 * @description 
	 * Connect a node to the BaseAudioContext hardware destination aka speakers
	*/
	connectToDestination(node: AudioNode) {
		node.connect(AudioMain.actx.destination);
	}

	/**
	 * @name connectToMusic
	 * @description connect a node to the input of the MainAudio WebAudioRenderer 
	 * which handles the music playback
	 */
	connectToSidechain(node: AudioNode) {
		const musicNode = get(EndNodes).get('music');
		node.connect(musicNode as AudioNode);
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
	 * @name updateOutputLevelWith
	 * @description a useful Elem render call which will scale
	 * a renderers output level with the passed node. Useful for 
	 * premaster level, fades etc.
	 */

	updateOutputLevelWith(renderer: ExtendedWebRenderer, node: Signal): void {
		AudioMain.master(renderer.id, undefined, { attenuator: node });
	};

	/**
	* @name master
	* @description Audible Master buss
	* Includes a stereo compressor, which is ducked by any signal routed to the sidechain   
	* initialisation option, arriving at el.in({channel:0})
	* @param stereoSignal optional stereo signal to render through the Master. 
	* If passed, it is stored in the AudioMain._out buss updating whatever was patched before.
	* @param attenuator optional attenuator signal which will smoothly scale the signal just
	* before final output, which is hard coded to be smooth scaled by the overall master volume. 
	* @param useExtSidechain optional boolean to use an external sidechain signal,
	* @param bypassCompressor optional boolean to bypass the compressor
	*/
	master(rendererId: RendererIdentifiers,
		stereoSignal?: StereoSignal | undefined,
		options?: {
			attenuator?: Signal | number | undefined,
			compressor?: { useExtSidechain?: boolean, bypassCompressor?: boolean }
		}): void {
		const { attenuator, compressor } = options || {};
		const { useExtSidechain = true, bypassCompressor = false } = compressor || {};	

		let targetRenderer: ExtendedWebRenderer = AudioMain._renderers.get(rendererId) as ExtendedWebRenderer;	

		if (stereoSignal) {
			targetRenderer.masterBuss = stereoSignal;
		} 
		const sc = useExtSidechain ? el.in({ channel: 0 }) : targetRenderer.masterBuss.left;

		const dynamics = bypassCompressor ? targetRenderer.masterBuss : {
			left: el.compress(20, 160, -35, 90, sc, targetRenderer.masterBuss.left),
			right: el.compress(20, 160, -35, 90, sc, targetRenderer.masterBuss.right)
		} 

		let master = attenuator ? attenuateStereo(dynamics, attenuator) : dynamics;
		master = attenuateStereo(master, AudioMain.masterVolume)
		const result = targetRenderer.render(master.left, master.right);
		console.groupCollapsed('Updated graph for ', rendererId, ' ፨ ', result)
	}

	/**
	 * @name controlRender
	 * @description silent render of a control signal using the secondary 'silent core' WebAudioRenderer,
	 * for rendering a signal with a side effect. For example the play progress counter, 
	 * which emits an event _and_ an audiorate signal, which we don't want to hear as it will likely 
	 * cause DC offset.
	 */
	controlRender(controlSignal: Signal): void {
		AudioMain._renderers.get('silent')?.render(el.mul(controlSignal, 0));
	}

	/**
	 * @name playWithScrub
	 * @description: Plays samples from a VFS path, with scrubbing
	 */
	playWithScrub(props: SamplerOptions) {
		AudioMain.master(
			'music', scrubbingSamplesPlayer(props),
			{
				compressor: { useExtSidechain: true, bypassCompressor: false }
			}
		);
		AudioMain.playProgressBar(props);
	}

	/**
	 * @name playProgressBar
	 * @description todo
	 */
	playProgressBar(props: SamplerOptions) {
		const { trigger, startOffset } = props;
		const key = AudioMain.currentTrackTitle
		const totalDurMs = props.durationMs || AudioMain.currentTrackDurationSeconds * 1000;

		const progressSignal = bufferProgress({
			key,
			totalDurMs,
			run: trigger as number,
			updateInterval: 10,
			startOffset
		})

		AudioMain.controlRender(progressSignal);
	}

	/**
	 * @name playSpeechFromVFS
	 */
	playSpeechFromVFS(gate: Number = 1): void {
		const { vfsPath, duration = 1000 } = AudioMain._currentSpeechMetadata as AssetMetadata;
		const phasingSpeech = driftingSamplesPlayer(
			{
				vfsPath,
				trigger: gate as number,
				rate: 0.901,
				drift: 1.0e-3,
				monoSum: true,
				durationMs: duration,
				rendererId: 'speech'
			});
		console.log('speech -> ', vfsPath);

		AudioMain.master('speech',
			{ left: el.meter(phasingSpeech.left), right: phasingSpeech.right },
			{ attenuator: AudioMain._voiceVolume, compressor: { bypassCompressor: true } });
	}


	/**
	 * @name updateVFStoRenderer
	 * @description Elementary Audio Renderers use a virtual file system to reference audio * files in memory.
	 * https://www.elementary.audio/docs/packages/web-renderer#virtual-file-system
	 * Update the virtual file system using data loaded from a load() function.
	 * @param container
	 * header and body ArrayBufferContainer - will be decoded to audio buffer for VFS use
	 * @param playlistStore
	 * a Writable that holds titles and other data derived from the buffers
	 * @param renderer
	 * the Elementary core which will register and use the VFS dictionary entry.
	 * 🚨 Guard against race conditions by only updating the VFS when the core is loaded.
	 */

	async updateVFStoRenderer(
		container: StructuredAssetContainer,
		renderer: ExtendedWebRenderer
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
				const vfsDictionaryEntry = { [vfsKey]: decoded.getChannelData(i) };
				renderer.updateVirtualFileSystem(vfsDictionaryEntry);
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
		try {
			decoded = await AudioMain.actx.decodeAudioData(body as ArrayBuffer);
		} catch (error) {
			console.warn('Decoding skipped, dummy buffer created ', error);
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
	 * @name unmute aka 'Play'
	 * @description Main way the music starts playing, from a user interaction.
	 */
	unmute(): void {
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

	/*--- handlers --------------------------------*/

	/**
	 * @name stateChangeHandler
	 * @description Callback when the base AudioContext state changes
	 */
	private stateChangeHandler = () => {
		AudioMain._contextIsRunning.update(() => {
			return AudioMain.actx.state === 'running';
		});
		AudioMain._MainAudioStatus.update(() => {
			console.log('Base context state change: ', AudioMain.baseState);
			return AudioMain.baseState;
		});
	};

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
		return AudioMain._currentTrackMetadata?.progress || 0;
	}
	get sidechain() {
		return this._sidechain;
	}
	get scrubbing(): boolean {
		return AudioMain._scrubbing;
	}
	get currentTrackDurationSeconds(): number {
		return AudioMain._currentTrackMetadata?.duration || -1;
	}
	get currentVFSPath(): string {
		return AudioMain._currentTrackMetadata?.vfsPath || 'no VFS path';
	}
	get buffersReady(): boolean {
		return get(Decoded).done
	}
	get currentTrackTitle(): string {
		return AudioMain._currentTrackMetadata?.title || '';
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
		AudioMain._currentTrackMetadata = { ...AudioMain._currentTrackMetadata, progress: newProgress };
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

/**
 * @name resumeContext
 * @description Tries to resume the base AudioContext
 * this should only be called once, after a user interaction
 */
export const resumeContext = () => {
	if (AudioMain.actx.state === 'suspended') {
		AudioMain.actx.resume().then(() => {
			console.log('AudioContext resumed ⚙︎');
		});
	}
}