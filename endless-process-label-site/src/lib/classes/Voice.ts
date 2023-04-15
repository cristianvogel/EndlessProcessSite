import type { AudioCoreStatus } from 'src/typeDeclarations';
import WebRenderer from '@elemaudio/web-renderer';
import { writable, type Writable } from 'svelte/store';
import { AudioCore } from '$lib/classes/Audio';

// ════════╡ Voice ╞═══════
// todo: start a seperate Elementary Web Audio API
// todo: add a way to set the voice's position in the audio file
// todo: add a way to set the voice's start offset in the audio file

export class VoiceCore extends AudioCore {
	#voiceCore: WebRenderer | null;
	#silentVoiceCore: WebRenderer | null;
	_voiceCoreStatus: Writable<AudioCoreStatus>;
	_currentVFSPath: string;
	_currentChapterID: string;
	_currentChapterDurationSeconds: number;
	_scrubbing: boolean;

	constructor() {
		super();
		this.#voiceCore = this.#silentVoiceCore = null;
		this._voiceCoreStatus = writable('loading');
		this._endNodes = writable({
			mainCore: null,
			silentCore: null
		});

		// these below are dynamically set from store subscriptions
		this._currentVFSPath = '';
		this._currentChapterID = '';
		this._currentChapterDurationSeconds = 0;
		this._scrubbing = false;
	}

	subscribeToStores() {
		/**
		 * @description
		 *  Subscribers to update VoiceCore with current info.
		 */
	}

	async init(): Promise<void> {
		VoiceOver.#voiceCore = new WebRenderer();
		VoiceOver.#silentVoiceCore = new WebRenderer();
		VoiceOver.subscribeToStores();

		VoiceOver.voiceEndNode = await VoiceOver.#voiceCore
			.initialize(super.actx, {
				numberOfInputs: 1,
				numberOfOutputs: 1,
				outputChannelCount: [2]
			})
			.then((node) => {
				console.log('Voice Core loaded  🎤');
				VoiceOver.status = 'ready';
				return node;
			});

		VoiceOver.silentVoiceEndNode = await VoiceOver.#silentVoiceCore
			.initialize(super.actx, {
				numberOfInputs: 1,
				numberOfOutputs: 1,
				outputChannelCount: [2]
			})
			.then((node) => {
				console.log('Silent Voice Core loaded  🎤');
				return node;
			});

		VoiceOver.#voiceCore.on('error', function (e) {
			console.error('🔇 ', e);
		});
		VoiceOver.#silentVoiceCore.on('error', function (e) {
			console.error('🔇 ', e);
		});
	}

	/* ---- Event Driven Callbacks ----------------- */

	/*---- getters --------------------------------*/

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
