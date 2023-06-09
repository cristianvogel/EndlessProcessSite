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
 * 
 * @todo catch offline and other connection errrors
*/
	import { fade, fly } from 'svelte/transition';
	import type { PageData } from '../../../routes/$types';
	import type { AssetCategories, NamedRenderers, StructuredAssetContainer } from '../../../typeDeclarations';
	import { ContextSampleRate, Decoded, VFS_Entries } from '$lib/stores/stores';
	import { stripTags } from '$lib/classes/Utils';
	import { AudioMain } from '$lib/classes/Audio';
	import { assign, sumLengthsOfAllArraysInVFSStore as VFS_Entries_Checksum } from '$lib/classes/Assets';

 	export let metadata: PageData;
	export let rangeLengthSeconds = 60;

	const clipExcerptLength = rangeLengthSeconds * ($ContextSampleRate || 44100);
	let hideTimer: NodeJS.Timeout;
	let ticker: number;
	let loadProgress: number;
	const tickerTimer = setInterval(() => {
		ticker++;
	}, 100);

	$: ready = $VFS_Entries.done
	$: loadProgress = (ready) ? (VFS_Entries_Checksum() + 1) : VFS_Entries_Checksum()
	$: hide = false;
	$: ticker = 0;
	$: if (ready) {
		clearInterval(tickerTimer);
		hideTimer = setTimeout(() => {
			Decoded.update( ($d) =>{ $d.done = true; return $d} );
			hide = true;
		}, 3 * 1.0e3);
	};

	function checkThenComplete ( element: HTMLElement, params: {category: AssetCategories | string}) {
			if (!ready) return
			if (!$VFS_Entries) return
			for (const key in $VFS_Entries) {
				if (Object.prototype.hasOwnProperty.call($VFS_Entries, key)) {
					const storedVFSDictionaryForCategory:Array<StructuredAssetContainer> = $VFS_Entries[key as AssetCategories];
					try {
						storedVFSDictionaryForCategory.forEach((entry) => {
						AudioMain.updateVFStoRenderer(entry, (key as NamedRenderers));
						});
					} catch (error) {
						console.warn( 'Bounds reached, finishing initialisation.' )
					}
				}
			}
			clearInterval(tickerTimer);	
		}	

	function setHeadersFor( category:AssetCategories){
	const headers = {
		music:  { 'Content-Type': 'audio/*', Range: `bytes=0-${clipExcerptLength}` },
		speech: { 'Content-Type': 'audio/*', Range: `` }
	}
	return headers[category]
	}

</script>

{#if !hide}
<span class="timer"> {ready ? 'Done ' : 'Currently '} accessing network. </span>
   <ul>
	<div class="fileinfo"  in:fade>
		{#await metadata.streamedMetaData.MPEGs}
			<div in:fade><h2>Initialising.</h2></div>
		{:then responseObject}
			{@const bounds = responseObject.data.mediaItems.edges.length}
			{#each responseObject.data.mediaItems.edges as edge, index}
			{@const updatedCategory = edge.node.Speech.chapter ? 'speech' : 'music'}
			{@const headers = setHeadersFor(updatedCategory) }
			{#await fetch( edge.node.mediaItemUrl, { method: 'GET', headers} )}
					{#if index === 0}
					   <i class='info'>Experiencing network problems, please wait or reload.</i>
					{/if}
				{:then responseObject}
					{#await responseObject.arrayBuffer()}
						<span class="h2 animate-pulse" data-sveltekit-noscroll out:fade>◶</span>
					{:then buffer}
						{@const loadedArrayBuffer = buffer}
						{@const caption = stripTags(edge.node.caption)}
						<li class={updatedCategory === 'speech' ? 'info-alt' : 'info'} id={updatedCategory} 
							use:assign={{
								assetContainer: { ...edge.node, 
									category: updatedCategory, 
									buffer: loadedArrayBuffer },
								index,
								bounds
							}}
							use:checkThenComplete={{category: updatedCategory}}
							in:fly={{ x: -200, duration: index * 200 }}
							out:fade>
							{`${edge.node.title} ${edge.node.fileSize} bytes`}<br />
							╰{@html caption ? caption : 'no detail'} <br />
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
		top: 8em;
		left: 1em;
	}

	.timer {
		position: absolute;
		top: 0.5rem;
		left: 0.5rem;
		color: orangered;
		font-size: x-small;
	}
</style>