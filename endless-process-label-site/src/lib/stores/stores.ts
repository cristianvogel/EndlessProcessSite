// CAV: This file is used to define the stores used in the app

import { writable, type Writable } from 'svelte/store';
import { audio } from '$lib/classes/AudioEngine';
import type { AudioStatus, CurrentPost, RawFFT } from 'src/typeDeclarations';

// Todo: Implement sanitiser for the content
export const currentPost: Writable<CurrentPost> = writable({
	title: '',
	content: { rawHTML: '', sanitisedHTML: '' },
	featuredImageURL: '',
	id: '',
	date: '',
	cardIndex: ''
});

/**
 * Keeping the audio renderer class in a store, adding functionality
 * to it as and when needed.
 */
export const ElementaryAudioEngine: Writable<typeof audio> = writable(audio);
export const audioStatus: Writable<AudioStatus> = writable('loading');
export const rawFFT: Writable<RawFFT> = writable({
	real: new Float32Array(0),
	imag: new Float32Array(0)
});

export const CablesAudioContext: Writable<AudioContext> = writable();
