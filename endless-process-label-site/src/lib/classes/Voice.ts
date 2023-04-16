import type { AudioCoreStatus, RawAudioBuffer, StereoSignal } from 'src/typeDeclarations';
import { get } from 'svelte/store';
import WebRenderer from '@elemaudio/web-renderer';
import { writable, type Writable } from 'svelte/store';
import { AudioCore } from '$lib/classes/Audio';
import { load } from '$lib/classes/IngestorSpeechFiles';
import { channelExtensionFor } from './Utils';
import { Decoding, PlaylistVoice } from '$lib/stores/stores';
import { stereoOut } from '$lib/audio/AudioFunctions';
import { el } from '@elemaudio/core';

// ════════╡ Voice ╞═══════
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
	_currentChapterName: string;

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
		this._currentChapterName = '';
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

		load({ fetch }).then((buffersContainer: any) => {
			console.log('speech buffers', buffersContainer);
			this.parallelDecoder(buffersContainer.buffers);
		});
		while (!super.actx) {
			console.log('Waiting for first WebRenderer instance to load...');
			await new Promise((resolve) => setTimeout(resolve, 100));
		}

		VoiceOver.voiceEndNode = await VoiceOver.#voiceCore
			.initialize(super.actx, {
				numberOfInputs: 1,
				numberOfOutputs: 1,
				outputChannelCount: [2]
			})
			.then((node) => {
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

		VoiceOver.#voiceCore.on('load', () => {
			console.log('Voice Core loaded  🎤');
			VoiceOver.status = 'ready';
			VoiceOver.resumeContext();
			// seems like there can only be one call to resumeContext() per context
			// so do it here instead of in the AudioCore constructor?
		});

		super.connectToDestination(VoiceOver.voiceEndNode);
	}

	async updateVFS(rawAudioBuffer: RawAudioBuffer) {
		let vfsDictionaryEntry: any;

		this.decodeRawBuffer(rawAudioBuffer).then(([decoded, vfsPath]) => {
			if (!decoded) {
				console.warn('Decoding skipped.');
				return;
			}
			// adds a channel extension to the path for each channel, the extension starts at 1 (not 0)
			for (let i = 0; i < decoded.numberOfChannels; i++) {
				vfsDictionaryEntry = {
					...vfsDictionaryEntry,
					[`${vfsPath}${channelExtensionFor(i + 1)}`]: decoded.getChannelData(i)
				};
			}
			console.log('vfsDictionaryEntry VOICE ->', vfsDictionaryEntry);
			VoiceOver.#voiceCore?.updateVirtualFileSystem(vfsDictionaryEntry);
		});
	}

	async decodeRawBuffer(rawAudioBuffer: RawAudioBuffer): Promise<[AudioBuffer | null, string]> {
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
			const { vfsPath } = header;
			const bytes = decoded?.getChannelData(0).length;
			header.bytes = bytes || 0;
			console.log(
				'Decoded audio with length ',
				bytes,
				' to ',
				vfsPath,
				' in ',
				Date.now() - stopwatch,
				'ms'
			);
			Decoding.update(($d) => {
				$d.done = true;
				return $d;
			});
		}
		// update the DurationElement in the playlist container map
		if (decoded && decoded.duration > 1) {
			PlaylistVoice.update(($plist) => {
				// guard against the 1 samp skipped buffer hack above
				if (!decoded) return $plist;
				$plist.durations.set(header.name, decoded.duration);
				return $plist;
			});
		}
		return [decoded, header.vfsPath];
	}

	// trying this here

	parallelDecoder(buffers: any) {
		let parallel: Array<any> = [];

		Promise.all(buffers).then((_buffers) => {
			for (let i = 0; i < _buffers.length; i++) {
				const track = _buffers[i];
				parallel.push(async () => {
					const decoded = await track.body;
					return VoiceOver.updateVFS({
						header: track.header,
						body: decoded
					});
				});
			}

			Promise.all(parallel.map((func) => func())).then((tracks) => {
				console.log('All ', tracks.length, ' SPEECH tracks decoded 🤷🏽 ', _buffers);
				//set the current track to the first track loaded from the playlist
				if (!VoiceOver._currentChapterName || VoiceOver._currentChapterName === '') {
					VoiceOver._currentChapterName = _buffers[0].header.name;
					VoiceOver._currentVFSPath = _buffers[0].header.vfsPath;
				}
			});
		});
	}
	// testing
	playFromVFS(): void {
		const test = VoiceOver._currentVFSPath + '.channel.1';
		VoiceOver.render({
			left: el.sample({ path: test, mode: 'trigger' }, 1, 1),
			right: el.sample({ path: test, mode: 'trigger' }, 1, 1)
		});
	}

	render(stereoSignal: StereoSignal): void {
		if (!VoiceOver.#voiceCore || !stereoSignal) return;
		VoiceOver.status = 'playing';
		const final = stereoOut(stereoSignal);
		VoiceOver.#voiceCore.render(final.left, final.right);
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
