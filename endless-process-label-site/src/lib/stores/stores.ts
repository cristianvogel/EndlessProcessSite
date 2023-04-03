// CAV: This file is used to define the stores used in the app

import { writable, type Writable } from 'svelte/store';
import type { SinglePost, RawFFT } from 'src/typeDeclarations';

// Todo: Implement sanitiser for the content
export const singlePost: Writable<SinglePost> = writable({
	title: '',
	content: { rawHTML: '', sanitisedHTML: '' },
	featuredImageURL: '',
	id: '',
	date: '',
	cardIndex: ''
});

export const rawFFT: Writable<RawFFT> = writable({
	real: new Float32Array(0),
	imag: new Float32Array(0)
});

/**
 * Cables patch
 */
export const CablesPatch: Writable<any> = writable('...loading...');
// export const CablesAudioContext: Writable<AudioContext> = writable();
export const CablesAudioFileURL: Writable<Array<string>> = writable([
	'audio/YohldteTvuezyz_AndersSkibsted.mp3',
	'audio/sound.mp3'
]);
export const CablesText: Writable<Array<string>> = writable(['Endless', 'Process']);
export const EndNodes: Writable<any> = writable({ elem: null, cables: null });
