import type { AudioCoreStatus, DecodedTrackContainer, ArrayBufferContainer, StereoSignal } from 'src/typeDeclarations';
import { get } from 'svelte/store';
import WebRenderer from '@elemaudio/web-renderer';
import { writable, type Writable } from 'svelte/store';
import { AudioCore } from '$lib/classes/Audio';
import { load } from '$lib/classes/IngestorSpeechFiles';
import { channelExtensionFor } from './Utils';
import { PlaylistSpeech, VFS_PATH_PREFIX } from '$lib/stores/stores';
import { stereoOut } from '$lib/audio/AudioFunctions';
import { el } from '@elemaudio/core';

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
	}

	async init(): Promise<void> {
		VoiceOver._core = new WebRenderer();
		VoiceOver._silentVoiceCore = new WebRenderer();

		/** 
		 * @description: load the speech buffers from the VFS
		 * for the music buffers, this is done in the +layout.ts file
		 * @todo: refactor this to be done in the same place?
		 */

		load({ fetch }).then((buffersContainer: any) => {
			console.log('speech buffers', buffersContainer);
			this.parallelDecoder(buffersContainer.buffers);
		});

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

		VoiceOver._core.on('load', () => {
			console.log('Voice Core loaded  🎤');
			VoiceOver.status = 'ready';
		});

		super.connectToDestination(VoiceOver.voiceEndNode);
	}

	/**
	 * @todo inherit decodeRawBuffer() from super
	 */

	async decodeRawBuffer(rawAudioBuffer: ArrayBufferContainer): Promise<DecodedTrackContainer> {
		const stopwatch = Date.now();
		while (!rawAudioBuffer) await new Promise((resolve) => setTimeout(resolve, 100));
		const { body, header } = rawAudioBuffer;
		let decoded: AudioBuffer | null = null;
		// we need audio context in order to decode the audio data
		while (!super.actx || !body) {
			await new Promise((resolve) => setTimeout(resolve, 100));
		}
		try {
			decoded = await super.actx.decodeAudioData(body as ArrayBuffer);
		} catch (error) {
			console.log(new Error('Decoding skipped. Dummy buffer created.'));
			decoded = super.actx?.createBuffer(1, 1, 44100);
		} finally {

			header.bytes = decoded?.getChannelData(0).length || 0;
			console.log(
				'Decoded audio with length ',
				header.bytes,
				' to ',
				header.vfsPath,
				' in ',
				Date.now() - stopwatch,
				'ms'
			);
		}
		// update the DurationElement in the playlist container map
		if (decoded && decoded.duration > 1) {
			PlaylistSpeech.update(($plist) => {
				// guard against the 1 samp skipped buffer hack above
				if (!decoded) return $plist;
				$plist.durations.set(header.title as string, decoded.duration);
				return $plist;
			});
		}
		return {
			title: header.title as string,
			vfsPath: header.vfsPath as string,
			decodedBuffer: decoded
		};
	}

	/**
	 * @description
	 * Parallel Assets Worker
	 * see ./src/+page.svelte
	 * @todo abstract out the parallel decoder
	 */

	parallelDecoder(buffers: any) {
		let parallel: Array<any> = [];
		Promise.all(buffers).then((resolved) => {
			for (let i = 0; i < resolved.length; i++) {
				const track: ArrayBufferContainer = resolved[i];

				const vfsPath = get(VFS_PATH_PREFIX) + track.header.title;
				const header = { ...track.header, vfsPath };
				parallel.push(async () => {
					const decoded: ArrayBuffer = await track.body;
					return super.updateVFS({
						header,
						body: decoded,
					}, PlaylistSpeech, VoiceOver);
				});
			}

			Promise.all(parallel.map((func) => func())).then(() =>
				console.log('SPEECH: Parallel promises resolved')
			);
		});
	}

	/**
	 * @todo inherit playFromVFS() & render() from super
	 */
	playFromVFS(): void {
		const test = get(PlaylistSpeech).currentChapter.vfsPath;
		console.log('playFromVFS speech->', test);
		VoiceOver.render({
			left: el.sample({ path: test, mode: 'trigger' }, 1, 1),
			right: el.sample({ path: test, mode: 'trigger' }, 1, 1)
		});
	}

	render(stereoSignal: StereoSignal): void {
		if (!VoiceOver._core || !stereoSignal) return;
		VoiceOver.status = 'playing';
		const final = stereoOut(stereoSignal);
		VoiceOver._core.render(final.left, final.right);
	}

	/*---- getters --------------------------------*/

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
