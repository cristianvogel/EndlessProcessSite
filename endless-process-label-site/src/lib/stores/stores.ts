// CAV: This file is used to define the stores used in the app

import { writable, type Writable } from 'svelte/store';
import { audio } from '$lib/classes/AudioEngine';
import type { AudioStatus, SinglePost, RawFFT } from 'src/typeDeclarations';

// Todo: Implement sanitiser for the content
export const singlePost: Writable<SinglePost> = writable({
	title: '',
	content: { rawHTML: '', sanitisedHTML: '' },
	featuredImageURL: '',
	id: '',
	date: '',
	cardIndex: ''
});

/**
 * Keeping the audio engine class in a store, adding functionality
 * to it as and when needed.
 */
export const ElementaryAudioEngine: Writable<typeof audio> = writable(audio);
export const audioStatus: Writable<AudioStatus> = writable('loading');
export const rawFFT: Writable<RawFFT> = writable({
	real: new Float32Array(0),
	imag: new Float32Array(0)
});

/**
 * Cables patch
 */
export const CablesPatch: Writable<any> = writable('loading');
export const CablesAudioContext: Writable<AudioContext> = writable();
export const CablesAudioFileURL: Writable<Array<string>> = writable([
	'audio/YohldteTvuezyz_AndersSkibsted.mp3',
	'audio/sound.mp3'
]);
export const CablesText: Writable<Array<string>> = writable(['Endless', 'Process']);
