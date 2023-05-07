import type { AssetMetadata, AudioCoreStatus, PlaylistContainer, Signal, StereoSignal } from '../../typeDeclarations';
import { get } from 'svelte/store';
import WebRenderer from '@elemaudio/web-renderer';
import { writable, type Writable } from 'svelte/store';
import { AudioCore } from '$lib/classes/Audio';
import { el } from '@elemaudio/core';
import { OutputMeters, PlaylistMusic, SpeechCoreLoaded, VFS_Entries_Speech } from '$lib/stores/stores';
import { attenuateStereo, driftingSamplesPlayer } from '$lib/audio/AudioFunctions';


// ════════╡ Voice WebRenderer Core ╞═══════
// todo: add a way to set the voice's position in the audio file
// todo: add a way to set the voice's start offset in the audio file
// 🚨 this is still a demo/test and not a full implementation


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
	 * @description Initialise the main WebRenderer instances handling the Speech 
	 * asynchronously and store in VoiceCore class as this._endNodes
	 */
	override async init(): Promise<void> {
		VoiceOver._core = new WebRenderer();
		while (!super.actx) {
			//console.log('Waiting for first WebRenderer instance to load...');
			await new Promise((resolve) => setTimeout(resolve, 50));
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
			// now we are sure Elementary is ready
			// update the VFS from the store
			const vfs = get(VFS_Entries_Speech);
			vfs.forEach(entry => {
				VoiceOver.updateVFS(entry, VoiceOver._core as WebRenderer);
			});
			SpeechCoreLoaded.set(true);
			VoiceOver.status = 'ready';
			console.log('Voice Core loaded  🎤');
			VoiceOver.patch();
		});	
	}

	/**
	 * @name patch
	 * @description 
	 * connects the VoiceOver core to the hardware output
	 * and also to the main WebRenderer instance handling the music.
	 * Which of course has already loaded cleanly, right?
	 */
	private patch() {
		super.connectToDestination(VoiceOver.voiceEndNode);
		super.connectToMain(VoiceOver.voiceEndNode);
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
		console.log('🎤 -> ', vfsPath);
		VoiceOver.master(test);
	}

	/**
	 * @name render
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
