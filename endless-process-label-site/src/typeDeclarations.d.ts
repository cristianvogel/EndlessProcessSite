import type { NodeRepr_t } from '@elemaudio/core';

interface SinglePost {
	title: string;
	content: HtmlContent;
	featuredImageUrl?: Url;
	id: string;
	date: string;
	cardIndex: string;
}
type AudioStatus = 'closed' | 'suspended' | 'running' | 'muted' | 'loading';
type HtmlContent = { rawHTML: string; sanitisedHTML: string };
type Url = string;
// type Post = { title: string; content?: HtmlContent };
type RawFFT = { real: Float32Array; imag: Float32Array };
type StereoSignal = { left: NodeRepr_t; right: NodeRepr_t };
