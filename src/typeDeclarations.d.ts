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
	audioAssetPaths?: { music: Array<string> | undefined, speech: Array<string> };
	titles: { music: Array<string>, speech: Array<string> }
	show?: boolean;
	durations: Map<string, number>;
}
type RawFFT = { real: Float32Array; imag: Float32Array };
type Signal = NodeRepr_t;
type StereoSignal = { left: NodeRepr_t; right: NodeRepr_t };
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


//════════╡ Data  ╞═══════

type HtmlContent = { rawHTML: string; sanitisedHTML: string };
type Url = string;
type AssetCategories = 'music' | 'speech'
type AssetContainers = { music: any, speech: any }
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

interface SinglePost {
	title: string;
	content: HtmlContent;
	featuredImageUrl?: Url;
	id: string;
	date: string;
	cardIndex: string;
	isOpen?: boolean;
}


//════════╡ AudioEngine :: Interfaces ╞═══════

interface detunedSaws {
	props: { ampMod: number };
	frequency: Signal | number;
}
interface stereoOut {
	props: {};
	stereoSignal: StereoSignal;
}

