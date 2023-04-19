// This file defines the stores used in the app

import { writable, type Readable, type Writable, readable, get } from 'svelte/store';
import type { SinglePost, RawFFT, PlaylistContainer, VoiceContainer } from 'src/typeDeclarations';
import { getMusicFiles, getSpeechFiles } from '$lib/classes/Files';

//---- UI related -------------------
export const loadingSomething: Writable<{ state: boolean; count: number }> = writable({
	state: false,
	count: 0
});

//---- Blog related -------------------
// Todo: Implement sanitiser for the content
export const singlePost: Writable<SinglePost> = writable({
	title: '',
	content: { rawHTML: '', sanitisedHTML: '' },
	featuredImageURL: '',
	id: '',
	date: '',
	cardIndex: '',
	isOpen: false
});

//---- Cables related -------------------
export const CablesPatch: Writable<any> = writable('...loading...');
export const CablesAudioContext: Writable<AudioContext> = writable();
export const CablesIsLoaded: Writable<boolean> = writable(false);
export const CablesText: Writable<Array<string>> = writable(['Endless', 'Process']);

//---- Audio related -------------------

/**
 * @Important decoding audio parallel buffers takes time. This store is used to signal when the decoding is done.
 */
export const Decoding: Writable<{ done: boolean; progress?: number }> = writable({
	done: false,
	progress: 0
});

/**
 * @Important  path prefix used as key for the Virtual File System (VFS)
 */
export const VFS_PATH_PREFIX: Readable<string> = readable('vfs::');
export const AUDIO_ASSETS_PREFIX: Readable<string> = readable('/audio/mp3');

/**
 * Playlist.
 * todo: description, duration, loaded flag,  non-filename titles.
 * Something like a semantic metadata layer for each track?
 */

export type DurationsMapElement = { key: string; value: number };
export const PlaysCount: Writable<number> = writable(0);
export const Playlist: Writable<PlaylistContainer> = writable({
	playlist: getMusicFiles(),
	durations: new Map<string, number>(),
	show: false,
	currentTrack: { name: '', path: '', loaded: false, progress: 0 }
});

export const Scrubbing: Writable<boolean> = writable(false);

//---------- Speech -----------------------

export const PlaylistSpeech: Writable<VoiceContainer> = writable({
	playlist: getSpeechFiles(),
	durations: new Map<string, number>(),
	currentChapter: { name: '', id: 'chapter-1', path: '', progress: 0 }
});

//---------- deprecating -----------------------
// probably not needed anymore, as sound output is all handled by the AudioCore now
export const EndNodes: Writable<any> = writable({ elem: null, cables: null });
export const rawFFT: Writable<RawFFT> = writable({
	real: new Float32Array(0),
	imag: new Float32Array(0)
});
