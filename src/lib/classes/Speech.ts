import type { AssetMetadata, AudioCoreStatus, PlaylistContainer, Signal, StereoSignal } from '../../typeDeclarations';
import { get } from 'svelte/store';
import WebRenderer from '@elemaudio/web-renderer';
import { writable, type Writable } from 'svelte/store';
import { AudioCore } from '$lib/classes/Audio';
import { el } from '@elemaudio/core';
import { OutputMeters, PlaylistMusic, SpeechCoreLoaded } from '$lib/stores/stores';
import { attenuateStereo, driftingSamplesPlayer } from '$lib/audio/AudioFunctions';


// ════════╡ Voice ╞═══════
// todo: add a way to set the voice's position in the audio file
// todo: add a way to set the voice's start offset in the audio file
// 🚨 this is still a demo/test and not a full implementation
// todo: update redundant class member properties

export class VoiceCore extends AudioCore {
	_core: WebRenderer;
	_voiceCoreStatus: Writable<AudioCoreStatus>;
	_voiceVolume: number | Signal;
	_currentMetadata: AssetMetadata;


	constructor() {
		super();
		this._core = null as unknown as WebRenderer;
		this._voiceCoreStatus = writable('loading');
		this._endNodes = writable({ mainCore: null, silentCore: null });
		this._voiceVolume = 1;
		// below gets updated from store subscription
		this._currentMetadata = { title: '', vfsPath: '', duration: 0 };
	}

	override subscribeToStores(): void {
		PlaylistMusic.subscribe(($p) => {
			this._currentMetadata = $p.currentChapter as AssetMetadata;
		});
	}

	override async init(): Promise<void> {
		VoiceOver._core = new WebRenderer();

		while (!super.actx) {
			console.log('Waiting for first WebRenderer instance to load...');
			await new Promise((resolve) => setTimeout(resolve, 100));
		}

		VoiceOver.voiceEndNode = await VoiceOver._core
			.initialize(super.actx, {
				numberOfInputs: 0,
				numberOfOutputs: 1,
				outputChannelCount: [2]
			})
			.then((node) => {
				return node;
			});

		VoiceOver._core.on('error', function (e) {
			console.error('🔇 ', e);
		});

		VoiceOver._core.on('meter', function (e) {
			OutputMeters.update(($o) => {
				const absMax = Math.max(e.max, Math.abs(e.min));
				$o = { ...$o, SpeechAudible: absMax };
				return $o;
			})
		})

		VoiceOver._core.on('load', () => {
			VoiceOver.subscribeToStores()
			SpeechCoreLoaded.set(true);
			VoiceOver.status = 'ready';
			console.log('Voice Core loaded  🎤');
		});

		super.connectToDestination(VoiceOver.voiceEndNode);
		super.connectToMain(VoiceOver.voiceEndNode);
	}

	playSpeechFromVFS(gate: Number = 1): void {
		const { vfsPath } = VoiceOver._currentMetadata;
		const test = driftingSamplesPlayer(VoiceOver,
			{
				vfsPath,
				trigger: gate as number,
				rate: 0.901,
				drift: 1.0e-3,
				monoSum: true,
			});
		console.log('🎤 -> ', vfsPath);
		VoiceOver.render(test);
	}

	override render(stereoSignal: StereoSignal, key?: string): void {
		// do I need a key here??
		if (!VoiceOver._core) return;
		VoiceOver.status = 'playing';
		let final = attenuateStereo(stereoSignal, VoiceOver.voiceVolume);
		VoiceOver._core.render(
			el.meter(final.left),
			final.right)
	}

	/*---- getters --------------------------------*/

	get sidechain() {
		return this._sidechain;
	}
	get voiceEndNode() {
		return get(this._endNodes).mainCore;
	}
	get voiceVolume() {
		return this._voiceVolume;
	}

	/*---- setters --------------------------------*/

	set voiceVolume(volume: number | Signal) {
		this._voiceVolume = volume;
	}
	set status(status: AudioCoreStatus) {
		this._voiceCoreStatus.update((s) => {
			return status;
		});
	}
	set voiceEndNode(node: AudioNode) {
		this._endNodes.update((endNodes) => {
			endNodes.mainCore = node;
			return endNodes;
		});
	}
	set silentVoiceEndNode(node: AudioNode) {
		this._endNodes.update((endNodes) => {
			endNodes.silentCore = node;
			return endNodes;
		});
	}
}

export const VoiceOver = new VoiceCore();
