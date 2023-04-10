// CAV: This file is used to define the stores used in the app

import { writable, type Readable, type Writable, readable } from 'svelte/store';
import type { SinglePost, RawFFT, PlaylistContainer, RawAudioBuffer } from 'src/typeDeclarations';

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
 * @Important  path prefix is used for loading audio files and updating the Virtual Files System reference
 */
export const VFS_PATH_PREFIX: Readable<string> = readable('/src/lib/audio/');

export const EndNodes: Writable<any> = writable({ elem: null, cables: null });

/**
 * Playlist... work in progress
 * todo: implement currentTrack.url and loaded setters
 * todo: dynamic load of file names from a folder. Currently kludged at Writable initialization
 * todo: more descriptive names / metadata
 */
export const Playlist: Writable<PlaylistContainer> = writable({
	playlist: ['YohldteTvuezyz_AndersSkibsted.mp3', 'Sflogs_AndersSkibsted.mp3'],
	currentTrack: { name: '', url: '', loaded: false }
});

