// import type { AssetMetadata, MainAudioStatus, Signal, StereoSignal } from '../../typeDeclarations';
// import WebAudioRenderer from '@elemaudio/web-renderer';
// import { writable, type Writable } from 'svelte/store';
// import { MainAudioClass } from '$lib/classes/Audio';
// import { el } from '@elemaudio/core';
// import { PlaylistMusic } from '$lib/stores/stores';
// import { driftingSamplesPlayer } from '$lib/audio/AudioFunctions';


/** ════════╡ Speech WebAudioRenderer Core ╞═══════
* @todo set the start offset in the audio file
* @todo swap into different chapters / tracks on the fly
*/

// export class VoiceCore extends MainAudioClass {
// 	_core: WebAudioRenderer;
// 	_voiceCoreStatus: Writable<MainAudioStatus>;
// 	_voiceVolume: number | Signal;
// 	_currentMetadata: AssetMetadata;

// 	constructor() {
// 		super();
// 		this._core = new WebAudioRenderer();
// 		this._voiceCoreStatus = writable('loading');
// 		this._voiceVolume = 0.727;

// 		// below gets updated from store subscription
// 		this._currentMetadata = { title: '', vfsPath: '', duration: 0 };
// 		this.subscribeToStores();
// 	}

// 	override subscribeToStores(): void {
// 		PlaylistMusic.subscribe(($p) => {
// 			this._currentMetadata = $p.currentChapter as AssetMetadata;
// 		});
// 	}

// 	/**
// 	 * @name playSpeechFromVFS
// 	 */
// 	playSpeechFromVFS(gate: Number = 1): void {
// 		const { vfsPath, duration = 1000 } = VoiceOver._currentMetadata;
// 		const phasingSpeech = driftingSamplesPlayer(
// 			{
// 				vfsPath,
// 				trigger: gate as number,
// 				rate: 0.901,
// 				drift: 1.0e-3,
// 				monoSum: true,
// 				durationMs: duration,
// 				rendererId: 'speech'
// 			});
// 		console.log('speech -> ', vfsPath);
// 		VoiceOver.status = 'playing';
// 		super.master('speech',
// 			{ left: el.meter(phasingSpeech.left), right: phasingSpeech.right },
// 			{ attenuator: VoiceOver._voiceVolume, compressor: { bypassCompressor: true } });
// 	}


// 	/*---- getters --------------------------------*/

// 	get voiceVolume() {
// 		return this._voiceVolume;
// 	}

// 	/*---- setters --------------------------------*/

// 	set voiceVolume(volume: number | Signal) {
// 		this._voiceVolume = volume;
// 	}
// 	set status(status: MainAudioStatus) {
// 		this._voiceCoreStatus.update((s) => {
// 			return status;
// 		});
// 	}
// }

// export const VoiceOver = new VoiceCore();