import type { AudioStatus, StereoSignal } from 'src/typeDeclarations';
import { CablesAudioFileURL, CablesPatch } from '$lib/stores/stores';
import { el, type NodeRepr_t } from '@elemaudio/core';
import WebRenderer from '@elemaudio/web-renderer';
import { detunedSaws } from '$lib/audio/synths';
import { get, derived, writable, type Writable } from 'svelte/store';
import { dualDelay } from '$lib/audio/effects';

// Store as OOPS/TS Singleton design pattern. Reference https://javascript.plainenglish.io/writing-a-svelte-store-with-typescript-22fa1c901a4

class AudioEngine {
	#core: WebRenderer | null;
	masterVolume: number | NodeRepr_t;

	constructor(
		zeroDC: NodeRepr_t = el.const({ value: 0 }),
		private _status: Writable<AudioStatus> = writable('loading'),
		private _isPlaying: Writable<boolean> = writable(false),
		private audioContext: Writable<AudioContext> = writable(),
		private endNodes: Writable<any> = writable({ elem: null, cables: null }),
		public elemStereoOut: Writable<StereoSignal> = writable({
			left: zeroDC,
			right: zeroDC
		})
	) {
		this.#core = null;
		this.masterVolume = 0.1;
	}

	get stores() {
		return {
			audioStatus: this._status,
			isPlaying: this._isPlaying,
			actx: this.audioContext,
			endNodes: this.endNodes,
			stereoOutSignal: this.elemStereoOut
		};
	}

	// Initialise the audio engine
	async init(ctx?: AudioContext): Promise<void> {
		Audio.#core = new WebRenderer();

		// Choose a context to use and stick with it
		if (ctx) {
			this.actx = ctx;
			console.log('Using existing AudioContext', this.actx);
		} else {
			this.actx = new AudioContext();
		}

		// BaseAudioContext state change callback
		this.actx.addEventListener('statechange', this._stateChangeHandler);
		// Elementary load callback
		Audio.#core.on('load', async () => {
			console.log('Elementary loaded 🔊?', this.elemEndNode);
		});
		// Elementary error reporting
		Audio.#core.on('error', function (e) {
			console.error(e);
		});
		// Elementary FFT callback
		Audio.#core.on('fft', function (e) {
			// do something with the FFT data
			console.count('fft');
		});
		// Elementary meter callback
		Audio.#core.on('meter', function (e) {
			if (e.source === 'cables') {
				console.log(e.max);
			}
		});

		// Elementary connecting promise
		this.elemEndNode = await Audio.#core
			.initialize(this.actx, {
				numberOfInputs: 1,
				numberOfOutputs: 1,
				outputChannelCount: [2]
			})
			.then((node) => {
				console.log('Elementary connected! 🔊');
				return node;
			});
	}

	get contextAndStatus() {
		return derived([this.audioContext, this._status], ([$audioContext, $status]) => {
			return { context: $audioContext, status: $status };
		});
	}

	get actx() {
		return get(this.contextAndStatus).context;
	}

	get audioStatus() {
		return get(this.contextAndStatus).status;
	}

	// todo: differenciate between playing and running, its getting confusing
	// the Audiocontext RUNS but it might not be PLAYING anything
	get isPlaying(): boolean {
		return get(this._isPlaying);
	}

	get isMuted(): boolean {
		return get(this._isPlaying);
	}

	get cablesEndNode() {
		return get(this.endNodes).cables;
	}

	get elemEndNode() {
		return get(this.endNodes).elem;
	}

	get baseState(): AudioStatus {
		return this.actx.state || 'error';
	}

	get stereoOut(): StereoSignal {
		// Elementary's stereo output signals
		return get(this.elemStereoOut);
	}

	set stereoOut({ left, right }: { left: NodeRepr_t; right: NodeRepr_t }) {
		this.elemStereoOut.update(() => ({ left, right }));
	}

	set actx(newCtx: AudioContext) {
		this.audioContext.update(() => newCtx);
	}

	set audioStatus(newStatus: AudioStatus) {
		this._status.update(() => newStatus);
	}
	set cablesEndNode(node: AudioNode) {
		this.endNodes.update((n) => {
			n.cables = node;
			return n;
		});
	}

	set elemEndNode(node: AudioNode) {
		this.endNodes.update((n) => {
			n.elem = node;
			return n;
		});
	}

	connectEndNodes() {
		const c: AudioNode = Audio.cablesEndNode as GainNode;
		if (!c) return;

		const e: AudioNode = Audio.elemEndNode as AudioNode;
		console.log('Nodes are valid and connected! 🎉: ');
		e.connect(Audio.actx.destination);
		// test: connect cables directly to the web audio context destination
		c.connect(e);
	}

	_stateChangeHandler = () => {
		const statusUpdate = Audio.actx.state;
		this._isPlaying.update(() => {
			return statusUpdate === 'running' ? true : false;
		});
		Audio._status.update(() => {
			console.log('Audio status updated to ', statusUpdate);
			return statusUpdate;
		});
	};

	resumeContext(): void {
		Audio.actx.resume().then(() => {
			console.log('AudioContext resumed.');
		});
	}

	/**
	 * Just render a signal, no side effects
	 */
	render(signal: NodeRepr_t): void {
		if (!Audio.#core) return;
		Audio.#core.render(signal);
	}

	/**
	 * Render DC Blocked signals as left and right output signals
	 */
	renderChannels(channels: StereoSignal): void {
		if (!Audio.#core) return;
		Audio.stereoOut = { left: el.dcblock(channels.left), right: el.dcblock(channels.right) };
		Audio.#core.render(
			el.mul(el.sm(Audio.masterVolume), Audio.stereoOut.left),
			el.mul(el.sm(Audio.masterVolume), Audio.stereoOut.right)
		);
	}

	runFFT(): void {
		if (Audio.audioStatus === 'running') {
			Audio.render(el.fft({ name: 'elFFT', key: 'fft' }, Audio.stereoOut.left));
		}
	}

	testTone(): void {
		console.log('test tone');
		Audio.renderChannels({
			left: el.cycle(460),
			right: el.cycle(463)
		});
	}
	/**
	 * A demo synth with four oscillators in stereo
	 */
	demoSynth(): void {
		Audio.renderChannels({
			left: detunedSaws({ ampMod: el.cycle(1 / 3) }, el.const({ key: 'L1', value: 60 })),
			right: detunedSaws({ ampMod: el.cycle(0.5) }, el.const({ key: 'R1', value: 90 }))
		});
	}

	/**
	 * Mute Elementary's final gain node and suspend the audio context
	 * optionally, send a Mute message to Cables patch
	 */
	muteAndSuspend(muteCables: boolean = true): void {
		console.log('mute and suspend');
		// Audio.renderChannels({
		// 	left: el.sm(0),
		// 	right: el.sm(0)
		// });
		if (muteCables) Audio.cablesAudio('mute');
		Audio.suspendAfterMs(100);
	}

	unmute(): void {
		console.log('unmuting -> ');
		Audio.cablesAudio('unmute');
		Audio.resumeContext();
		if (Audio.#core) {
			const cablesStereoIn: StereoSignal = {
				left: dualDelay({ len: 1000, fb: 0.3 }, el.in({ channel: 0 }), el.in({ channel: 1 })),
				right: dualDelay({ len: 1000, fb: 0.3 }, el.in({ channel: 1 }), el.in({ channel: 0 }))
			};

			Audio.renderChannels(cablesStereoIn);
		}
		//Audio.runFFT();
	}

	cablesAudio(state: 'mute' | 'unmute'): void {
		// a function that swaps the elements of an array
		function swap(arr: any[], i: number = 0, j: number = 1) {
			[arr[i], arr[j]] = [arr[j], arr[i]];
			arr = [...arr, arr.length]; // add a new element to the array to trigger reactivity in subscribers
			return arr;
		}
		// wouldn't this be better as a start/stop event inside the cables patch?

		console.log('asking cables to ', state);
		const audioAssets = get(CablesAudioFileURL);
		CablesAudioFileURL.set(swap(audioAssets));
		const nextTrack = get(CablesAudioFileURL)[0];
		console.log('next track is ', nextTrack);
		const patch = get(CablesPatch);
		patch.setVariable('CablesMute', state === 'mute' ? '1' : '0');
		patch.setVariable('CablesAudioFileURL', nextTrack);
		patch.config.spinAndPrompt('', '∿', '');
	}

	getCablesAudioNode(varCablesGainNode: any): void {
		let cablesConnection: GainNode;
		if (varCablesGainNode.getValue()) {
			cablesConnection = varCablesGainNode.getValue();
			console.log('Cables GainNode → ', cablesConnection);
			Audio.cablesEndNode = cablesConnection;
		} else {
			console.log(`Can't find Cables Patch GainNode!...`);
		}
	}

	suspend(): void {
		Audio.actx.suspend().then(() => {
			console.log('🔇 audiocontext suspended');
		});
	}

	suspendAfterMs(ms: number = 100): void {
		new Promise((res) => setTimeout(res, ms)).then(() => {
			this.renderChannels({ left: el.sm(0), right: el.sm(0) });
			Audio.actx.suspend().then(() => {
				console.log('🔇 audiocontext suspended');
			});
		});
	}
}

export const Audio: AudioEngine = new AudioEngine();
