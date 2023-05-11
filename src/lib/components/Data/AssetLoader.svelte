<script lang="ts">

/**
 * @file AssetLoader.svelte
 * @description 
 * Component that unravels the metadata from the GraphQL response 
 * and fetches  audio file assets. Implemented largely using Svelte inline DOM code.
 * Which is fast, reactive and easy to animate. But difficult to debug...
 * This component should try to adapt implementation methods according to the category of the assets
 * which is passed in the props. The metadata for each category is served by +page.ts into the 
 * PageData dynamic type.
 * Currently, speech is retrieved from local (global) asset path
 * and music from CMS. But, the big idea is to encode TTS on the fly  
 * using the Eleven Labs API when a post changes, and cache the results. 
*/
	import { fade, fly } from 'svelte/transition';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import type { PageData } from '../../../routes/$types';
	import type { AssetCategories, StructuredAssetContainer } from '../../../typeDeclarations';
	import { ContextSampleRate, Decoded, VFS_Entries } from '$lib/stores/stores';
	import { stripTags } from '$lib/classes/Utils';
	import { Audio as Music } from '$lib/classes/Audio';
	import { assign } from '$lib/classes/Assets';
	import { tick } from 'svelte';
	import { VoiceOver } from '$lib/classes/Speech';
	import type WebAudioRenderer from '@elemaudio/web-renderer';

 	export let metadata: PageData;
	export let category:AssetCategories;
	export let rangeLengthSeconds = 60;

	const clipExcerptLength = rangeLengthSeconds * ($ContextSampleRate || 44100);
	let assetsCollectionSize: number;
	let hideTimer: NodeJS.Timeout;
	let ticker: number;
	const tickerTimer = setInterval(() => {
		ticker++;
	}, 100);
	
	const coreForCategory = (category: AssetCategories):WebAudioRenderer => {
		switch (category) {
			case 'music':
				return Music._core;
			case 'speech':
				return VoiceOver._core;
			default:
				return Music._core;
		}
	};

	$: ready = false;
	$: bounds = $Decoded.bounds as number;
	$: hide = false;
	$: ticker = 0;
	$: tick().then( ()=> {
			if ( bounds > 0 ) {
			ready = $VFS_Entries[category].length > (bounds - 1)}
		})
	$: if (ready) {
		const storedVFSEntries: Array<StructuredAssetContainer> = $VFS_Entries[category];
		storedVFSEntries.forEach((entry) => {
			Music.updateVFS(entry, coreForCategory(category));
		});
		clearInterval(tickerTimer);
		Decoded.update( ($d) =>{ $d.done = true; return $d} );
		hideTimer = setTimeout(() => {
			hide = true;
		}, 3 * 1.0e3);
	}

</script>

{#if !hide}
<span class="timer">{ticker * 100} ms</span>
   <ul>
	<div class="fileinfo" style="{category === 'music' ? 'left: 1rem' : 'right: 1rem'}" in:fade>
		{#await metadata.streamedMetaData[category]}
			<div in:fade><h2>Initialising {category}.</h2></div>
		{:then responseObject}
			{@const sum = assetsCollectionSize = responseObject.data.mediaItems.edges.length}
			{@const VFS_Store = $VFS_Entries[category]}
			<div out:fade><h3>{ready ? ' Ready.' : 'Fetching Endproc Playlist.'}</h3></div>
			<ProgressBar value={VFS_Store.length} max={sum} />
			{#each responseObject.data.mediaItems.edges as edge, index}
				{#await fetch( edge.node.mediaItemUrl, { method: 'GET', headers: { 'Content-Type': 'audio/*', Range: `bytes=0-${clipExcerptLength}` } } )}
					<span class="h1 animate-rotate" data-sveltekit-noscroll out:fade>◶</span>
				{:then responseObject}
					{#await responseObject.arrayBuffer()}
						<span class="h2 animate-pulse" data-sveltekit-noscroll out:fade>◶</span>
					{:then buffer}
						{@const loadedArrayBuffer = buffer}
						{@const caption = stripTags(edge.node.caption)}
						<li class="info" id={category}
							use:assign={{
								assetContainer: { ...edge.node, category, buffer: loadedArrayBuffer },
								index,
								sum
							}}
							in:fly={{ x: -200, duration: index * 200 }}
							out:fade
						>
							{`${edge.node.title} ${edge.node.fileSize} bytes`}<br />
							╰{@html caption ? caption : 'no detail'} <br />
							{`╰ ${edge.node.mediaItemUrl}`}<br />
						</li>
					{/await}
				{/await}
			{/each}
		{/await}
	</div>
</ul>
{/if}

<style>
	.fileinfo {
		position: absolute;
		bottom: 16rem;
	}

	.timer {
		position: absolute;
		top: 0.5rem;
		left: 0.5rem;
		color: orangered;
		font-size: x-small;
	}
</style>