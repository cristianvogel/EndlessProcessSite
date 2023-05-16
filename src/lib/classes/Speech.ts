import type { AssetMetadata, MainAudioStatus, Functionality, Signal, StereoSignal } from '../../typeDeclarations';
import { get } from 'svelte/store';
import WebAudioRenderer from '@elemaudio/web-renderer';
import { writable, type Writable } from 'svelte/store';
import { MainAudio } from '$lib/classes/Audio';
import { el } from '@elemaudio/core';
import { OutputMeters, PlaylistMusic, SpeechCoreLoaded } from '$lib/stores/stores';
import { attenuateStereo, driftingSamplesPlayer } from '$lib/audio/AudioFunctions';
import { customEvents } from '$lib/audio/EventHandlers';


/** ════════╡ Speech WebAudioRenderer Core ╞═══════
* @todo set the start offset in the audio file
* @todo swap into different chapters / tracks on the fly
*/

export class VoiceCore extends MainAudio {
	_core: WebAudioRenderer;
	_voiceCoreStatus: Writable<MainAudioStatus>;
	_voiceVolume: number | Signal;
	_currentMetadata: AssetMetadata;

	constructor() {
		super();
		this._core = null as unknown as WebAudioRenderer;
		this._voiceCoreStatus = writable('loading');
		this._voiceVolume = 0.727;

		// below gets updated from store subscription
		this._currentMetadata = { title: '', vfsPath: '', duration: 0 };
	}

	override subscribeToStores(): void {
		PlaylistMusic.subscribe(($p) => {
			this._currentMetadata = $p.currentChapter as AssetMetadata;
		});
	}

	/**
	 * @name init
	 * @description Initialise the main WebAudioRenderer instances handling the Speech 
	 * asynchronously and store in VoiceCore class as this._endNodes
	 */
	override async init(): Promise<void> {
		this._core = new WebAudioRenderer();
		while (!super.actx) {
			console.log('Waiting for first WebAudioRenderer instance to load...');
			await new Promise((resolve) => setTimeout(resolve, 50));
		}
		const metering: Functionality = customEvents.meter
		VoiceOver.subscribeToStores()
		super.init(
			{ id: 'speech', renderer: VoiceOver._core },
			super.actx,
			{
				connectTo: { sidechain: true },
				extraFunctionality: [metering]
			}
		);


		// VoiceOver._core.on('load', () => {
		// 	VoiceOver.subscribeToStores()
		// 	SpeechCoreLoaded.set(true);
		// 	VoiceOver.status = 'ready';
		// 	console.log('Speech core loaded  🎤');
		// 	VoiceOver.patch();
		// });	
	}

	// /**
	//  * @name patch
	//  * @description
	//  * connects the VoiceOver core to the hardware output
	//  * and also to the main WebAudioRenderer instance handling the music.
	//  * Which of course has already loaded cleanly, right?
	//  */
	// private patch() {
	// 	super.connectToDestination(VoiceOver.voiceEndNode);
	// 	super.connectToMusic(VoiceOver.voiceEndNode);
	// }

	/**
	 * @name playSpeechFromVFS
	 */
	playSpeechFromVFS(gate: Number = 1): void {
		const { vfsPath, duration = 1000 } = VoiceOver._currentMetadata;
		const test = driftingSamplesPlayer(VoiceOver,
			{
				vfsPath,
				trigger: gate as number,
				rate: 0.901,
				drift: 1.0e-3,
				monoSum: true,
				durationMs: duration
			});
		console.log('🎤 -> ', vfsPath);
		VoiceOver.master(test);
	}

	/**
	 * @name master
	 * @description renders a stereo signal via the voice core
	 * This render has a side effect of firing a meter update on VoiceOver._core
	 * It's output routes to the parent core, appearing as sidechain signal 
	 * at el.in({channel: 0}) at super.render()
	 */
	override master(stereoSignal: StereoSignal, attenuator?: Signal | number, key?: string): void {
		if (!VoiceOver._core) return;
		if (!attenuator) attenuator = VoiceOver._voiceVolume;
		VoiceOver.status = 'playing';
		let final = attenuateStereo(stereoSignal, attenuator);
		VoiceOver._core.render(
			el.meter(final.left),
			final.right)
	}


	/*---- getters --------------------------------*/

	get sidechain() {
		return this._sidechain;
	}
	get voiceVolume() {
		return this._voiceVolume;
	}

	/*---- setters --------------------------------*/

	set voiceVolume(volume: number | Signal) {
		this._voiceVolume = volume;
	}
	set status(status: MainAudioStatus) {
		this._voiceCoreStatus.update((s) => {
			return status;
		});
	}
}

export const VoiceOver = new VoiceCore();
