<script lang="ts">

	import { fade, fly } from 'svelte/transition';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import type { PageData } from '../../../routes/$types';
	import type { AssetCategories, StructuredAssetContainer } from '../../../typeDeclarations';
	import { Decoded, VFS_Entries } from '$lib/stores/stores';
	import { stripTags } from '$lib/classes/Utils';
	import { Audio } from '$lib/classes/Audio';
	import { assign } from '$lib/classes/Assets';
	import { tick } from 'svelte';

 	export let metadata: PageData;
	export let category:AssetCategories;

	let assetsCollectionSize: number;
	let clipExcerptLength = 60 * 44100;
	let hideTimer: NodeJS.Timeout;
	let ticker: number;
	const tickerTimer = setInterval(() => {
		ticker++;
	}, 100);
	

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
			Audio.updateVFS(entry, Audio._core);
		});
	}
	$: if (ready) {
		clearInterval(tickerTimer);
		hideTimer = setTimeout(() => {
			Decoded.update( ($d) =>{ $d.done = true; return $d} );
			hide = true;
		}, 3 * 1.0e3);
	}

</script>

{#if !hide}
<span class="timer">{ticker * 100} ms</span>
   <ul>
	<div class="fileinfo" in:fade>
		{#await metadata.streamedMetaData[category]}
			<div in:fade><h2>Initialising.</h2></div>
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
		left: 1rem;
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