import type { DurationsMapElement } from '$lib/stores/stores';
import type { NodeRepr_t } from '@elemaudio/core';
import type { Writable } from 'svelte/store';

//-════════╡ Music and Speech ╞═══════

type AssetMetadata = {
	title?: string;
	vfsPath?: string;
	loaded?: boolean;
	duration?: number;
	offset?: number;
	progress?: number;
}

interface PlaylistContainer {
	currentTrack?: AssetMetadata;
	currentChapter?: AssetMetadata;
	audioAssetPaths: { music?: Array<string> | undefined, speech: Array<string> | undefined };
	titles: { music: Array<string>, speech: Array<string> }
	show?: boolean;
	durations: Map<string, number>;
}

type SamplerOptions = {
	vfsPath?: string; // defaults to current track
	trigger?: Signal | number;
	rate?: Signal | number;
	durationMs?: number;
	startOffset?: number;
	drift?: Signal | number;
	loop?: boolean;
	loopStart?: number;
	loopEnd?: number;
	monoSum?: boolean;
};
type ProgressOptions = {
	key?: string;
	totalDurMs?: number;
	run: Signal | number;
	updateInterval?: number;
	startOffset?: number;
};

type MetersContainer = {
	MusicAudible?: number,
	MusicSilent?: number,
	SpeechAudible?: number,
	SpeechSilent?: number,
}


//════════╡ Data  ╞═══════

type TitlesPaths = { titles: string[], paths: string[] }
type Url = string;
type AssetCategories = 'music' | 'speech';
type AssetCategoryContainers = { [K in AssetCategories]: any } & { other?: any }; // https://chat.openai.com/c/9e74f559-27b4-4baf-b4b8-f4ab637ecc86
type AudioAssetMetadata = {
	category: AssetCategories
	mediaItemUrl: string;
	fileSize: number;
	title: string;
	caption: string;
	format?: string;
	buffer?: AudioBuffer | ArrayBuffer | undefined
}
type StructuredAssetContainer = {
	header: {
		globPath: string;
		title?: string;
		bytes?: number;
		vfsPath?: string;
	};
	body: ArrayBuffer | AudioBuffer | undefined;
} | undefined;




//════════╡ CMS  ╞═══════
type HtmlContent = { rawHTML: string; sanitisedHTML: string };
interface SinglePost {
	title: string;
	content: HtmlContent;
	featuredImageUrl?: Url;
	id: string;
	date: string;
	cardIndex: string;
	isOpen?: boolean;
}

// Tricky Typescript stuff for annotating the responses from CMS asset loader
// which got complicated when I decided to do that inline as a Svelte component
// see AssetLoader.svelte
type CategoryMapping<T> = T extends keyof any ? { [K in T]: string } : never;
type ResolvedPageData = CategoryMapping<AssetCategories> & {
	[key: string]: {
		mediaItems: {
			edges: Array<{ node: AudioAssetMetadata }>;
		};
	};
}

//════════╡ AudioEngine ╞═══════

interface MessageEvent { data: number }
interface MeterEvent extends MessageEvent { min: number, max: number }
interface AudioEvent extends MessageEvent, MeterEvent { };
type AudioEventExpression<T> = {
	progress: any;
	meter: any;
};

interface RendererInitialisationProps {
	namedRenderer: NamedWebAudioRenderer,
	ctx?: AudioContext,
	options?: InitialisationOptions
}
interface stereoOut {
	props: {};
	stereoSignal: StereoSignal;
}
type Signal = NodeRepr_t;
type StereoSignal = { left: NodeRepr_t; right: NodeRepr_t };
type Functionality = Function
type RendererIdentifiers = 'silent' | 'music' | 'speech'
type NamedWebAudioRenderer = { id: RendererIdentifiers, renderer: WebAudioRenderer }
type InitialisationOptions = {
	connectTo?: { destination?: boolean, visualiser?: boolean, sidechain?: boolean, nothing?: boolean },
	eventExpressions?: undefined,
}
type RawFFT = { real: Float32Array; imag: Float32Array };
type MainAudioStatus =
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
