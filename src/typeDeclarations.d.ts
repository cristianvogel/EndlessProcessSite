import type { DurationsMapElement } from '$lib/stores/stores';
import type { NodeRepr_t } from '@elemaudio/core';
import type WebAudioRenderer from '@elemaudio/web-renderer';
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
	currentTrack: AssetMetadata;
	currentChapter: AssetMetadata;
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
	SpeechAudible?: number,
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
type NamedRenderers = "data" | "music" | "speech";
type RendererStatus =
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
type RendererObservables = {
	[K in NamedRenderers]: RendererStatus
}
type StandardAudioEvents = "meter" | "snapshot" | "fft" | "load" | "scope";

type Expression = (event: AudioEvent) => void;
type AudioEventExpressions = Partial<Record<StandardAudioEvents, Expression>>;
type EventExpressionsForNamedRenderer = Map<NamedRenderers, AudioEventExpressions>;
interface MessageEvent { data: number, source: string }
interface MeterEvent extends MessageEvent { min: number, max: number }
interface AudioEvent extends MessageEvent, MeterEvent { };
interface WebRendererExtended extends WebAudioRenderer {
	masterBuss: StereoSignal,
	id: NamedRenderers,
	master(): void,
};

interface RendererInitialisation {
	id: NamedRenderers,
	ctx?: AudioContext,
	eventExpressions?: any,
	options?: {
		connectTo?: {
			destination?: boolean, visualiser?: boolean, sidechain?: boolean, nothing?: boolean
		}
	}
}

interface stereoOut {
	props: {};
	stereoSignal: StereoSignal;
}
type Signal = NodeRepr_t;
type StereoSignal = { left: NodeRepr_t; right: NodeRepr_t };
type Functionality = Function
type RawFFT = { real: Float32Array; imag: Float32Array };
