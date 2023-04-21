// This file defines the stores used in the app

import { writable, type Readable, type Writable, readable, get } from 'svelte/store';
import type { SinglePost, RawFFT, MusicContainer, SpeechContainer } from 'src/typeDeclarations';
import { getMusicFiles, getSpeechFiles } from '$lib/classes/Files';

//---- UX / State related -------------------
export const LoadingSomething: Writable<{ state: boolean; count: number }> = writable({
	state: false,
	count: 0
});

export const LayoutDataLoaded: Writable<boolean> = writable(false);

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


//----------------- Music -----------------------
/** 
 * @todo: ID3, description, loaded flag
 */
export const PlaylistMusic: Writable<MusicContainer> = writable({
	audioAssetPaths: getMusicFiles(),
	titles: new Array<string>(),
	durations: new Map<string, number>(),
	show: false,
	currentTrack: {
		title: '',
		vfsPath: '',
		loaded: false,
		duration: 0,
		offset: 0,
		progress: 0
	}
});
export type DurationsMapElement = { key: string; value: number };
export const PlaysCount: Writable<number> = writable(0);


export const Scrubbing: Writable<boolean> = writable(false);

//---------- Speech -----------------------

export const PlaylistSpeech: Writable<SpeechContainer> = writable({
	audioAssetPaths: getSpeechFiles(),
	titles: new Array<string>(),
	durations: new Map<string, number>(),
	currentChapter: { title: '', vfsPath: '', duration: 0, progress: 0 }
});

//---------- deprecating zone -----------------------
// probably not needed anymore, as sound output is all handled by the AudioCore now
export const EndNodes: Writable<any> = writable({ elem: null, cables: null });
export const rawFFT: Writable<RawFFT> = writable({
	real: new Float32Array(0),
	imag: new Float32Array(0)
});

// export const AUDIO_ASSETS_PREFIX: Readable<string> = readable('/audio/mp3');