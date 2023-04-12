// This file defines the stores used in the app

import { writable, type Readable, type Writable, readable } from 'svelte/store';
import type { SinglePost, RawFFT, PlaylistContainer } from 'src/typeDeclarations';
import { getFiles } from '$lib/classes/Files';

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
 * Cables patch related
 */
export const CablesPatch: Writable<any> = writable('...loading...');
export const CablesAudioContext: Writable<AudioContext> = writable();
export const CablesIsLoaded: Writable<boolean> = writable(false);
export const CablesText: Writable<Array<string>> = writable(['Endless', 'Process']);

//---- Audio engine related -------------------

/**
 * @Important decoding audio parallel buffers takes time. This store is used to signal when the decoding is done.
 */
export const Decoding: Writable<{ done: boolean; progress?: number }> = writable({
	done: false,
	progress: 0
});

/**
 * @Important  path prefix used to locate audio file source _and_ as key for the Virtual File System (VFS)
 */
export const VFS_PATH_PREFIX: Readable<string> = readable('/src/lib/audio/mp3/');

/**
 * Playlist... work in progress
 * todo: dynamic load of file names from a folder. Currently kludged at Writable initialization
 * todo: description fields and non-filename titles. Something like a semantic metadata layer for each track?
 */
export const Playlist: Writable<PlaylistContainer> = writable({
	playlist: getFiles(),
	currentTrack: { name: '', path: '', loaded: false }
});

//---------- deprecating -----------------------
// probably not needed anymore, as sound output is all handled by the AudioEngine now
export const EndNodes: Writable<any> = writable({ elem: null, cables: null });
