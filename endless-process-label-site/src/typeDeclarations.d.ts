import type { NodeRepr_t } from '@elemaudio/core';
import type { Writable } from 'svelte/store';

interface SinglePost {
	title: string;
	content: HtmlContent;
	featuredImageUrl?: Url;
	id: string;
	date: string;
	cardIndex: string;
}

type AudioEngineStatus = 'suspended' | 'loading' | 'playing' | 'paused' | 'closed ' | 'running';

type PlaylistContainer = {
	currentTrack: { name: string; path: string; loaded: boolean };
	playlist: Array<string>;
};

type HtmlContent = { rawHTML: string; sanitisedHTML: string };

type Url = string;
// type Post = { title: string; content?: HtmlContent };

type RawFFT = { real: Float32Array; imag: Float32Array };

type StereoSignal = { left: NodeRepr_t; right: NodeRepr_t };

type SamplerOptions = {
	vfsPath?: string;
	trigger?: Signal | number;
	rate?: Signal | number;
	loop?: boolean;
	loopStart?: number;
	loopEnd?: number;
};
type Signal = NodeRepr_t;

export type RawAudioBuffer = {
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