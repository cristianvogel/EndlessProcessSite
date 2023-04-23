import type { AudioCoreStatus, DecodedTrackContainer, ArrayBufferContainer, StereoSignal } from '../../typeDeclarations';
import { get } from 'svelte/store';
import WebRenderer from '@elemaudio/web-renderer';
import { writable, type Writable } from 'svelte/store';
import { AudioCore } from '$lib/classes/Audio';

import { OutputMeters, PlaylistMusic, SpeechCoreLoaded, VFS_PATH_PREFIX } from '$lib/stores/stores';
import { meter, stereoOut } from '$lib/audio/AudioFunctions';
import { el, type NodeRepr_t } from '@elemaudio/core';

// ════════╡ Voice ╞═══════
// todo: add a way to set the voice's position in the audio file
// todo: add a way to set the voice's start offset in the audio file
// 🚨 this is still a demo/test and not a full implementation

export class VoiceCore extends AudioCore {
	_core: WebRenderer | null;
	_silentVoiceCore: WebRenderer | null;
	_voiceCoreStatus: Writable<AudioCoreStatus>;
	_currentVFSPath: string;
	_currentChapterID: string;
	_currentChapterDurationSeconds: number;
	_scrubbing: boolean;
	_currentChapterName: string;
	_sidechain: number;

	constructor() {
		super();
		this._core = this._silentVoiceCore = null;
		this._voiceCoreStatus = writable('loading');
		this._endNodes = writable({
			mainCore: null,
			silentCore: null
		});

		// these below are dynamically set from store subscriptions
		this._currentVFSPath = '';
		this._currentChapterID = '';
		this._currentChapterName = '';
		this._currentChapterDurationSeconds = 0;
		this._scrubbing = false;
		this._sidechain = 0;
	}

	subscribeToStores(): void {
		OutputMeters.subscribe(($meters) => {
			this._sidechain = $meters['MusicAudible'] || 0;
		});
	}

	async init(): Promise<void> {
		VoiceOver._core = new WebRenderer();
		VoiceOver._silentVoiceCore = new WebRenderer();
		VoiceOver.subscribeToStores();

		/** 
		 * @description: load the speech buffers from the VFS
		 * for the music buffers, this is done in the +layout.ts file
		 * @todo: refactor this to be done in the same place?
		 */

		// load the speech files

		while (!super.actx) {
			console.log('Waiting for first WebRenderer instance to load...');
			await new Promise((resolve) => setTimeout(resolve, 100));
		}


		// initialise the voice cores
		VoiceOver.voiceEndNode = await VoiceOver._core
			.initialize(super.actx, {
				numberOfInputs: 1,
				numberOfOutputs: 1,
				outputChannelCount: [2]
			})
			.then((node) => {
				return node;
			});

		VoiceOver.silentVoiceEndNode = await VoiceOver._silentVoiceCore
			.initialize(super.actx, {
				numberOfInputs: 1,
				numberOfOutputs: 1,
				outputChannelCount: [2]
			})
			.then((node) => {
				console.log('Silent Voice Core loaded  🎤');
				return node;
			});

		VoiceOver._core.on('error', function (e) {
			console.error('🔇 ', e);
		});
		VoiceOver._silentVoiceCore.on('error', function (e) {
			console.error('🔇 ', e);
		});

		VoiceOver._core.on('meter', function (e) {
			OutputMeters.update(($o) => {
				$o = { ...$o, SpeechAudible: e.max };
				return $o;
			})
		})

		VoiceOver._core.on('load', () => {
			SpeechCoreLoaded.set(true);
			console.log('Voice Core loaded  🎤');
			VoiceOver.status = 'ready';
		});

		super.connectToDestination(VoiceOver.voiceEndNode);
	}

	/**
	 * @description hacky version of a mono 2 stereo
	 * @todo inherit playFromVFS() & render() from super
	 * @todo this is soundhacky for fun, will need refining into Memoised audio functions
	 */
	playFromVFS(gate: Number = 1): void {

		const test = get(PlaylistMusic).currentChapter?.vfsPath;
		console.log('Speech Test hard coded vfs path! ->', test);

		const lr =
			[
				el.sample({ path: test, mode: 'gate' },
					gate as number,
					0.901),

				el.sample({ path: test, mode: 'gate' },
					gate as number,
					0.900)
			];

		VoiceOver.render({
			left:
				lr[0],
			right:
				lr[1]
		}, 'vox');
	}

	render(stereoSignal: StereoSignal, key?: string): void {
		if (!VoiceOver._core || !stereoSignal) return;
		VoiceOver.status = 'playing';
		const final = stereoOut(stereoSignal, key);
		VoiceOver._core.render(el.add(meter(final), final.left), final.right);
	}

	/*---- getters --------------------------------*/

	get sidechain() {
		return this._sidechain;
	}
	get voiceEndNode() {
		return get(this._endNodes).mainCore;
	}

	/*---- setters --------------------------------*/

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
