import { get, writable, type Writable } from 'svelte/store';
import type {
	Signal,
	AssetMetadata,
	StructuredAssetContainer,
	SamplerOptions,
	NamedRenderers,
	RendererInitialisation,
	RendererStatus
} from '../../typeDeclarations';

import { scrubbingSamplesPlayer, bufferProgress, driftingSamplesPlayer } from '$lib/audio/AudioFunctions';
import { channelExtensionFor } from '$lib/classes/Utils';
import {
	CablesPatch,
	PlaylistMusic,
	OutputMeters,
	RendererStatus as $RendererStatus,
	VFS_PATH_PREFIX,
	Decoded,
	ContextSampleRate,
	MusicAssetsReady,
	EndNodes
} from '$lib/stores/stores';
import WebRendererExtended from '$lib/classes/WebRendererExtended';
import { el, type NodeRepr_t } from '@elemaudio/core';



// ════════╡ Music WebAudioRenderer Core ╞═══════

export class MainAudioClass {
	_renderersMap: Map<NamedRenderers, WebRendererExtended>;
	_contextIsRunning: Writable<boolean>;
	_audioContext: Writable<AudioContext>;
	_endNodes: Map<string, AudioNode>;
	_masterVolume: Writable<number | Signal>;
	_currentTrackMetadata: AssetMetadata;
	_currentSpeechMetadata: AssetMetadata;
	_scrubbing: boolean;
	_sidechain: number | Signal;
	_assetsReady: boolean;


	constructor() {
		this._masterVolume = writable(0.808); // default master volume
		this._contextIsRunning = writable(false);
		this._audioContext = writable();
		this._renderersMap = new Map()

		// these here below are dynamically set from store subscriptions
		this._endNodes = get(EndNodes) as Map<string, AudioNode>;
		this._currentTrackMetadata = get(PlaylistMusic).currentTrack as AssetMetadata;
		this._currentSpeechMetadata = get(PlaylistMusic).currentChapter as AssetMetadata;
		this._scrubbing = false;
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
		$RendererStatus.subscribe(($scrubbing) => {
			this._scrubbing = Object.values($scrubbing).includes('scrubbing') 
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
	*/
	async initialiseRenderer(props: RendererInitialisation): Promise<void> {
		const { id, ctx, eventExpressions, options } = props;
		const { connectTo } = options ?? { connectTo: { nothing: true } };

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

		// instantiate a named WebAudioRenderer instance 
		// and store it in the Map
		console.log('initialising renderer ', id)
		AudioMain._renderersMap.set(id, new WebRendererExtended(id));

		// add any extra functionality for a 
		// named renderer as event handlers then
		// register them with the renderer
		AudioMain.registerCallbacksFor(id, eventExpressions);

		// ok, add listener for base AudioContext state changes
		AudioMain.actx.addEventListener('statechange', AudioMain.stateChangeHandler);

		// initialise the WASM worklet and get an AudioNode back
		const endNode = await AudioMain.attachToRenderer(id)
			.initialize(AudioMain.actx, {
				numberOfInputs: 1,
				numberOfOutputs: 1,
				outputChannelCount: [2]
			}).then((node: AudioNode) => {
				console.log('✅ initialised renderer ', id)
				$RendererStatus.update(($s) => { $s[id] = 'ready'; return $s }) 
				return node
			})

		// update stored Map with reference to the last node of the initialised 
		// renderer for routing from one renderer to another
		EndNodes.update((_nodesMap) => {
			_nodesMap.set(id, endNode);
			return _nodesMap;
		})

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
		};
		console.groupEnd();

		// done
		return Promise.resolve();
	}

	registerCallbacksFor(id: NamedRenderers, eventExpressions: any) {
		const renderer = AudioMain.attachToRenderer(id);
		// any audio Event-Driven functionality can be added
		// emitted by el.snapshot, el.meter etc
		if (eventExpressions) {
			Object.keys(eventExpressions).forEach((name: string) => {
				const event = { name, expression: eventExpressions[name] }
				console.log(` ╠ ${event.name}`)
				renderer.on(event.name, event.expression);
			});
			console.groupEnd();
		};
		console.group('Added Audio Event Expressions to', renderer)
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
	 * @name attenuateRendererWith
	 * @description a useful Elem render call which will scale
	 * a renderers output level with the passed node. Useful for 
	 * premaster level, fades etc.
	 */

	attenuateRendererWith(id: NamedRenderers, node: Signal): void {
		const renderer: WebRendererExtended = AudioMain.renderThrough(id);
		renderer.mainOut(undefined, { attenuator: node });
	};

	/**
	 * @name renderDataSignal
	 * @description ideally a silent render of a control signal using a 'data' WebAudioRenderer,
	 * Use to generate an audio rate control signal with a side effect. 
	 * For example the play progress counter emits an event _and_ an audiorate data signal, 
	 * which we don't want to hear as it will likely sound horrible or cause DC offset.
	 */
	renderDataSignal(dataSignal: Signal): void {
		AudioMain.updateRendererState('data', 'playing');
		AudioMain.renderThrough('data').dataOut(el.mul(dataSignal, 0) as Signal);
	}

	/**
	 * @name renderMusicWithScrub
	 * @description: Plays samples from a VFS path, with scrubbing
	 */
	renderMusicWithScrub(props: SamplerOptions) {
		const isScrubbing = AudioMain.getRendererState('music') === 'scrubbing';
		// keep music play state handler here
		AudioMain.updateRendererState('music', isScrubbing ? 'scrubbing' : props.trigger as number === 0 ? 'paused' : 'playing')
		// render the scrubbable music player, full bhuna
		AudioMain.renderThrough('music').mainOut(
			scrubbingSamplesPlayer(props), {
			compressor: {
				useExtSidechain: true, bypassCompressor: false
				}
			}
		);
		AudioMain.renderProgressBar(props);
	}

	/**
	 * @name playProgressBar
	 * @description 
	 */
	renderProgressBar(props: SamplerOptions) {
		const { trigger, startOffset = 0 } = props;
		const key = AudioMain.currentTrackTitle
		const totalDurMs = props.durationMs || AudioMain.currentTrackDurationSeconds * 1000;

		const progress = bufferProgress({
			key,
			totalDurMs,
			run: trigger as number,
			updateInterval: 10,
			startOffset
		})
		AudioMain.renderDataSignal(progress);
	}

	/**
	 * @name playSpeechFromVFS
	 */
	playSpeechFromVFS(gate: number = 1): void {

		this.updateRendererState('speech', (gate as number < 1) ? 'playing' : 'paused');
		const { vfsPath, duration = 1000 } = AudioMain._currentSpeechMetadata as AssetMetadata;
		const phasingSpeech = driftingSamplesPlayer({
			vfsPath,
			trigger: gate as number,
			rate: 0.901,
			drift: 1.0e-3,
			monoSum: true,
			durationMs: duration
		});
		console.log('speech playing from -> ', vfsPath);

		AudioMain.renderThrough('speech').mainOut(
			{ left: el.meter(phasingSpeech.left), right: phasingSpeech.right },
			{ compressor: { bypassCompressor: true } }
		);
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
		id: NamedRenderers
	) {
		// decoder
		AudioMain.decodeRawBuffer(container).then((data) => {
			let { decodedBuffer: decoded, title } = data;
			if (!decoded || decoded.length < 16) {
				console.warn('Decoding skipped.');
				return;
			}

			const renderer = AudioMain.attachToRenderer(id);
			// adds a channel extension, starts at 1 (not 0)
			for (let i = 0; i < decoded.numberOfChannels; i++) {
				const vfsKey = get(VFS_PATH_PREFIX) + title + channelExtensionFor(i + 1);
				const vfsDictionaryEntry = { [vfsKey]: decoded.getChannelData(i) };
				AudioMain.attachToRenderer(id).updateVirtualFileSystem(vfsDictionaryEntry);
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
		AudioMain.renderMusicWithScrub({
			vfsPath: AudioMain.currentVFSPath,
			trigger: 1,
			durationMs: AudioMain.currentTrackDurationSeconds * 1000
		});
	}

	/**
	 * @name pause
	 * @description Stop sounding the music renderer and update its state store.
	 * maybe send a throttle or pause message to Cables patch?
	 */
	pause(pauseCables: boolean = false): void {
		// release gate on the current track
		AudioMain.renderMusicWithScrub({
			vfsPath: AudioMain.currentVFSPath,
			trigger: 0,
			durationMs: AudioMain.currentTrackDurationSeconds * 1000
		});
		if (pauseCables) AudioMain.pauseCables('throttle');
	}

	// todo: pause,resume or throttle Cables patch
	pauseCables(state: 'throttle' | 'pause' | 'resume'): void { }

	/*--- handlers --------------------------------*/

	/**
	 * @name stateChangeHandler
	 * @description Callback when the base AudioContext state changes
	 */
	private stateChangeHandler = () => {
		AudioMain._contextIsRunning.update(() => {
			return AudioMain.actx.state === 'running';
		});
	};

	/*---- getters  --------------------------------*/

	renderThrough(id: NamedRenderers): WebRendererExtended {
		return this.getRenderer(id);
	}
	attachToRenderer(id: NamedRenderers): WebRendererExtended {
		return this.getRenderer(id);
	}
	getRenderer(id: NamedRenderers): WebRendererExtended {
		return AudioMain._renderersMap.get(id) as WebRendererExtended;
	}
	getRendererState(id: NamedRenderers): RendererStatus {
		return get($RendererStatus)[id];
	}
	get stores() {
		// todo: refactor these to Tan-Li Hau's subsciber pattern
		// https://www.youtube.com/watch?v=oiWgqk8zG18
		return {
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
	get actx() {
		return get(AudioMain._audioContext);
	}
	get baseState() {
		return get(AudioMain._audioContext).state ?? 'suspended';
	}
	get isRunning(): boolean {
		return get(AudioMain._contextIsRunning);
	}
	get endNodes(): Map<string, AudioNode> {
		return AudioMain._endNodes;	
	}


	/*---- setters --------------------------------*/

	updateRendererState(id: NamedRenderers, status: RendererStatus) {
		$RendererStatus.update(($s) => { $s[id] = status; return $s })
	}
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