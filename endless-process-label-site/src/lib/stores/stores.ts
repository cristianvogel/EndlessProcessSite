// CAV: This file is used to define the stores used in the app

import { writable, type Writable } from 'svelte/store';
import type { SinglePost, RawFFT, PlaylistContainer } from 'src/typeDeclarations';

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
export const CablesAudioContext: Writable<AudioContext> = writable();
export const CablesIsLoaded: Writable<boolean> = writable(false);
export const CablesText: Writable<Array<string>> = writable(['Endless', 'Process']);

/**
 * Audio engine
 */
export const Samples: Writable<ArrayBuffer | null> = writable(null);
export const EndNodes: Writable<any> = writable({ elem: null, cables: null });

/**
 * Playlist
 */
export const Playlist: Writable<PlaylistContainer> = writable({
	VFS_PREFIX: '/vfs/ENDPROC/',
	currentTrack: { name: '', url: '', loaded: false },
	playlist: ['YohldteTvuezyz_AndersSkibsted.mp3', 'sound.mp3']
});