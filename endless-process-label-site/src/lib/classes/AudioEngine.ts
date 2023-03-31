import type { AudioStatus } from 'src/typeDeclarations';
import { audioStatus, CablesAudioFileURL, CablesPatch } from '$lib/stores/stores';
import { el, type NodeRepr_t } from '@elemaudio/core';
import WebRenderer from '@elemaudio/web-renderer';
import { detunedSaws } from '$lib/audio/synths';
import { get } from 'svelte/store';

class AudioEngine {
	_core: WebRenderer | null;
	_audioContext: AudioContext | null;
	_state: AudioStatus;
	_leftOut: NodeRepr_t;
	_rightOut: NodeRepr_t;
	masterVolume: number | NodeRepr_t;

	constructor() {
		const zeroDC: NodeRepr_t = el.const({ value: 0 });
		this._state = 'loading';
		this._core = null;
		this._audioContext = null;
		this._leftOut = zeroDC;
		this._rightOut = zeroDC;
		this.masterVolume = 0.25;
	}

	async init(ctx?: AudioContext): Promise<void> {
		// Initialise the Elementary audio engine
		this._core = new WebRenderer();

		// Choose a context to use and stick with it
		if (ctx) {
			this._audioContext = ctx;
		} else {
			this._audioContext = new AudioContext();
		}

		// sync state of Elementary with the BaseAudioContext
		this._state = this.baseState;

		/**  🔊 Define Callbacks */

		// Elementary load callback
		this._core.on('load', () => {
			console.log('Elementary loaded 🔊');
		});
		// Elementary error reporting
		this._core.on('error', function (e) {
			console.error(e);
		});
		// Elementary FFT callback
		this._core.on('fft', function (e) {
			// do something with the FFT data
			console.count('fft');
		});
		// BaseAudioContext state change callback
		this._audioContext.addEventListener('statechange', this._stateChangeHandler);

		/** End of Callback definitions 🔊 */

		// Elementary connecting promise
		let node = await this._core.initialize(this._audioContext, {
			numberOfInputs: 0,
			numberOfOutputs: 1,
			outputChannelCount: [2]
		});
		// now wire up the Elementary graph to the AudioContext output
		node.connect(this._audioContext.destination);
	}

	_stateChangeHandler = () => {
		this._state = this.baseState;
		// reflect the state change in the store
		audioStatus.update((_) => {
			return this._state;
		});
	};

	public get baseState(): AudioStatus {
		return this._audioContext?.state || 'closed';
	}

	public get state(): AudioStatus {
		return this._state;
	}

	resume(): void {
		this._audioContext?.resume().then(() => {
			console.log('AudioContext resumed');
		});
	}

	// todo: differenciate between playing and running, its getting confusing
	// the Audiocontext RUNS but it might not be PLAYING anything
	public get isPlaying(): boolean {
		return this._state === 'running' ? true : false;
	}

	public get isMuted(): boolean {
		return !this.isPlaying;
	}
	/**
	 * Just render a signal, no side effects
	 */
	render(signal: NodeRepr_t): void {
		if (!this._core) return;
		this._core.render(signal);
	}

	/**
	 * Render DC Blocked signals as left and right output signals with following side effects;
	 * Set state to playing, store left and right output signals in this.leftOut and this.rightOut
	 */
	renderChannels(channels: any): void {
		if (!this._core) return;
		this._leftOut = el.dcblock(channels.L);
		this._rightOut = el.dcblock(channels.R);
		this._core.render(
			el.mul(el.sm(this.masterVolume), this._leftOut),
			el.mul(el.sm(this.masterVolume), this._rightOut)
		);
	}

	runFFT(): void {
		if (this._state === 'running') {
			this.render(el.fft({ name: 'elFFT', key: 'fft' }, this._leftOut));
		}
	}

	testTone(): void {
		console.log('test tone');
		this.renderChannels({ L: el.cycle(460), R: el.cycle(463) });
	}

	demoSynth(): void {
		this.renderChannels({
			L: detunedSaws({ ampMod: el.cycle(1 / 3) }, el.const({ key: 'L1', value: 60 })),
			R: detunedSaws({ ampMod: el.cycle(0.5) }, el.const({ key: 'R1', value: 90 }))
		});
	}

	muteAndSuspend(): void {
		console.log('mute and suspend');
		this.renderChannels({ L: el.sm(0), R: el.sm(0) });
		this.cablesAudio('mute');
		this._suspend();
		audioStatus.set(this._state);
	}

	unmute(): void {
		console.log('unmuting -> ');
		this.cablesAudio('unmute');
		this._state = 'running';
		this.resume();
		audioStatus.set(this._state);
		//this.runFFT();
	}

	cablesAudio(state: 'mute' | 'unmute'): void {
		// a function that swaps the elements of an array
		function swap(arr: any[], i: number = 0, j: number = 1) {
			[arr[i], arr[j]] = [arr[j], arr[i]];
			return arr;
		}

		console.log('cables asked to ', state);
		const audioAssets = get(CablesAudioFileURL);
		CablesAudioFileURL.set(swap(audioAssets));
		const nextTrack = get(CablesAudioFileURL)[0];
		console.log('next track is ', nextTrack);
		const patch = get(CablesPatch);
		patch.setVariable('CablesMute', state === 'mute' ? '1' : '0');
		patch.setVariable('CablesAudioFileURL', nextTrack);
		patch.config.spinAndPrompt('', '∿', '');
	}

	_suspend(): void {
		this._audioContext?.suspend().then(() => {
			console.log('🔇 audiocontext suspended');
		});
	}
}

export const audio: AudioEngine = new AudioEngine();
