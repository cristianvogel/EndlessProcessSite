import type { AssetMetadata, MainAudioStatus, Signal, StereoSignal } from '../../typeDeclarations';
import WebAudioRenderer from '@elemaudio/web-renderer';
import { writable, type Writable } from 'svelte/store';
import { MainAudioClass } from '$lib/classes/Audio';
import { el } from '@elemaudio/core';
import { PlaylistMusic } from '$lib/stores/stores';
import { attenuateStereo, driftingSamplesPlayer } from '$lib/audio/AudioFunctions';


/** ════════╡ Speech WebAudioRenderer Core ╞═══════
* @todo set the start offset in the audio file
* @todo swap into different chapters / tracks on the fly
*/

export class VoiceCore extends MainAudioClass {
	_core: WebAudioRenderer;
	_voiceCoreStatus: Writable<MainAudioStatus>;
	_voiceVolume: number | Signal;
	_currentMetadata: AssetMetadata;

	constructor() {
		super();
		this._core = new WebAudioRenderer();
		this._voiceCoreStatus = writable('loading');
		this._voiceVolume = 0.727;

		// below gets updated from store subscription
		this._currentMetadata = { title: '', vfsPath: '', duration: 0 };
		this.subscribeToStores();
	}

	override subscribeToStores(): void {
		PlaylistMusic.subscribe(($p) => {
			this._currentMetadata = $p.currentChapter as AssetMetadata;
		});
	}

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
		console.log('speech -> ', vfsPath);
		VoiceOver.master(test);
	}

	/**
	 * @name master
	 * @description renders a stereo signal via the Speech renderer
	 * This render has a side effect of firing a meter update on VoiceOver._core
	 * It's output routes to the parent core, routed to sidechain signal 
	 * at el.in({channel: 0}) (see super.render())
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