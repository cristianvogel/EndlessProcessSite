import type { DurationsMapElement } from '$lib/stores/stores';
import type { NodeRepr_t } from '@elemaudio/core';
import type { Writable } from 'svelte/store';

interface SinglePost {
	title: string;
	content: HtmlContent;
	featuredImageUrl?: Url;
	id: string;
	date: string;
	cardIndex: string;
	isOpen?: boolean;
}

type AudioCoreStatus =
	| 'suspended'
	| 'loading'
	| 'resuming'
	| 'playing'
	| 'paused'
	| 'closed '
	| 'running'
	| 'ready'
	| 'scrubbing'
	| 'error';

interface PlaylistContainer {
	currentTrack: {
		progress: number;
		name: string;
		path: string;
		loaded?: boolean;
		duration?: number;
		offset?: number;
	};
	playlist: Array<string>;
	show: boolean;
	durations: Map<string, number>;
}

type HtmlContent = { rawHTML: string; sanitisedHTML: string };

type Url = string;
// type Post = { title: string; content?: HtmlContent };

type RawFFT = { real: Float32Array; imag: Float32Array };

type StereoSignal = { left: NodeRepr_t; right: NodeRepr_t };

type SamplerOptions = {
	vfsPath?: string; // defaults to current track
	trigger?: Signal | number;
	rate?: Signal | number;
	loop?: boolean;
	loopStart?: number;
	loopEnd?: number;
	startOffset?: number;
};

type ProgressOptions = {
	key?: string;
	totalDurMs?: number;
	run: Signal | number;
	rate?: number;
	startOffset?: number;
};

type Signal = NodeRepr_t;

type RawAudioBuffer = {
	header: { name: string; bytes: number; vfsPath: string };
	body: ArrayBuffer | Promise<ArrayBuffer>;
};

//════════╡ AudioEngine :: Interfaces ╞═══════

interface detunedSaws {
	props: { ampMod: number };
	frequency: Signal | number;
}

interface stereoOut {
	props: {};
	stereoSignal: StereoSignal;
}

//════════╡ Voice ╞═══════
type ChapterID = `chapter-${string}`;
interface VoiceContainer extends Omit<PlaylistContainer, 'currentTrack' | 'show'> {
	currentChapter: {
		progress: number;
		name: string;
		id: ChapterID;
		path: string;
	};
}