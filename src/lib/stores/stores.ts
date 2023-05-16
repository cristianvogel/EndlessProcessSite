// This file defines the stores used in the app

import { writable, type Readable, type Writable, readable } from 'svelte/store';
import type { SinglePost, RawFFT, PlaylistContainer, MetersContainer, AssetCategoryContainers, RendererIdentifiers } from '../../typeDeclarations';

//---- UX / State related -------------------
export const Decoded: Writable<{ done: boolean; bounds?: number }> = writable({
	done: false,
	bounds: 0
});
export const MusicCoreLoaded: Writable<boolean> = writable(false);
export const SpeechCoreLoaded: Writable<boolean> = writable(false);
export const MusicAssetsReady: Writable<boolean> = writable(false);

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
export const ForceAudioContextResume: Writable<any> = writable(() => { console.log('ForceAudioContextResume not initialised') })
export const ContextSampleRate: Writable<number> = writable(44100);
export const OutputMeters: Writable<MetersContainer> = writable(
	{
		MusicAudible: 0,
		MusicSilent: 0,
		SpeechAudible: 0,
		SpeechSilent: 0
	}
)

/**
 * @Important  path prefix used as key for the Virtual File System (VFS)
 * @Concept dynamic namespaces system for VFS?
 */
export const VFS_PATH_PREFIX: Readable<string> = readable('vfs::');

export const VFS_Entries: Writable<AssetCategoryContainers & { done: boolean }> = writable({
	music: [],
	speech: [],
	done: false,
});




//----------------- Sounding Assets -----------------------
/** 
 * @todo:  better descriptions from meta data
 * not using local music assets `audioAssetPaths: {music:... }` cos  
 * fetching music tracks from CMS but keep here for future features
 * like a drum machine, ambience generator or something
 */
export const PlaylistMusic: Writable<PlaylistContainer> = writable({
	audioAssetPaths: { music: undefined, speech: undefined },
	titles: { music: new Array<string>(), speech: new Array<string>() },
	durations: new Map<string, number>(),
	show: false,
	currentTrack: {
		title: '',
		vfsPath: '',
		loaded: false,
		duration: 0,
		offset: 0,
		progress: 0
	},
	currentChapter: {
		progress: 0,
		title: '',
		vfsPath: '',
		duration: 0,
		offset: 0
	}
});
export type DurationsMapElement = { key: string; value: number };
export const PlaysCount: Writable<number> = writable(0);
export const Scrubbing: Writable<boolean> = writable(false);



//----------------- WebAudio -----------------------

export const EndNodes: Writable<Map<RendererIdentifiers, AudioNode>> = writable(new Map<RendererIdentifiers, AudioNode>());


//---------- deprecating zone --- 🚮 --------------------
/** 
 * @deprecated 
 * 
 * */

export const rawFFT: Writable<RawFFT> = writable({
	real: new Float32Array(0),
	imag: new Float32Array(0)
});

// export const AUDIO_ASSETS_PREFIX: Readable<string> = readable('/audio/mp3');