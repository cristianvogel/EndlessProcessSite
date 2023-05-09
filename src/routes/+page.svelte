<script lang="ts">
	/**
	 * @description
	 * Parallel Assets Worker
	 */
	import type { PageData } from './$types';
	import { VFS_PATH_PREFIX, PlaylistMusic, Decoded, VFS_Entries_Music, VFS_Entries_Speech, AssetsReady } from '$lib/stores/stores';
	import { get } from 'svelte/store';
	import { VoiceOver } from '$lib/classes/Speech';
	import type { AssetCategories, AudioAssetMetadata, StructuredAssetContainer } from '../typeDeclarations';
  	import { fade, fly } from 'svelte/transition';
	import { ProgressBar } from '@skeletonlabs/skeleton';

	export let data: PageData;

	$:hide = false
	
	const hideTimer = setTimeout(() => {
		hide = true;
		$Decoded.done = true
	}, 8 * 1.0e3);
  
	let structuredContainer: { music: StructuredAssetContainer; speech: StructuredAssetContainer } = {
		music: undefined,
		speech: undefined
	};
	  const prefix = get(VFS_PATH_PREFIX);

 function assignAssets(element: HTMLElement, params: { assetContainer: AudioAssetMetadata; index: number; sum: number }) {

		const { assetContainer, index, sum } = params;
		const { mediaItemUrl, title, caption, fileSize, buffer } = assetContainer;

		const category:AssetCategories | string = element.id || assetContainer.category || 'other';
		if (category === 'music' || category === 'speech') {
		
			PlaylistMusic.update(($p) => {
				$p.titles[category] = [...$p.titles[category], title];
				return $p;
			});
			
			structuredContainer[category] = {
				header: {
					title: title,
					bytes: fileSize,
					globPath: mediaItemUrl,
					vfsPath: `${prefix}${title || ('untitled_'+index)}`
				},
				body: buffer || undefined,
			};
		// add the VFS entry to the dictionary for later assignment
		// when we are absolutely sure the Elementary core is ready
		if (category === 'music') {
			VFS_Entries_Music.update(($v) => {
				console.log( 'storing =-> ',structuredContainer['music'] )
				$v = [...$v, structuredContainer['music']];
				return $v;
			});
		} else {
			VFS_Entries_Speech.update(($v) => {
				$v = [...$v, structuredContainer['speech']];
				return $v;
			});
		}
		if (index >= sum) { 
			AssetsReady.update(($ok) => {
				$ok = true;
				return $ok
			})
		}
	}
}
	function stripTags(inputHTML: string): string | null {
		const parser = new DOMParser();
		const doc: Document = parser.parseFromString(inputHTML, 'text/html');
		const strippedHTML = doc.body.textContent;
		return strippedHTML;
}
</script>

{#if !$Decoded.done}
<ul><div class='fileinfo' in:fade>
	{#await (data.streamedMetaData.metadata)}
	<div in:fade><h2>Initialising.</h2></div>
	{:then responseObject}
	{@const sum = responseObject.data.mediaItems.edges.length}
	<div out:fade><h3>Fetching Endproc Playlist</h3></div>
    {#each responseObject.data.mediaItems.edges as edge, index}
		{#await fetch(edge.node.mediaItemUrl, {method:'GET', headers: { 'Content-Type': 'audio/*'}})}
		<li><span class='h2'>Payload ×{sum}.</span></li>
		{:then responseObject}
			{#await responseObject.arrayBuffer()}
			<span class='h3' out:fade>Loading Audio. <ProgressBar height='h-1'/></span> 
			{:then buffer}
				{@const loadedArrayBuffer = buffer}
				<span class='h4'>{buffer.byteLength}</span>
				{@const caption = stripTags( edge.node.caption )}
				<li class= 'info' id= 'music'
				use:assignAssets={{assetContainer: {...edge.node, category: 'music', buffer: loadedArrayBuffer}, index, sum }}
					in:fly="{{ x: -200, duration: index * 200 }}" 
					out:fade>
					{`${edge.node.title} ${edge.node.fileSize} bytes`}<br/>
					╰{ @html (caption? caption : 'no detail') } <br/>
					{`╰ ${edge.node.mediaItemUrl}`}<br/>
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
		top: 10rem;
	}
</style>


<!-- {#each data.speechStreamed.buffers as promising, index }
	  {#await Promise.resolve(promising)}
			<li class="text-sm text-secondary-600">
					{'▁▂▃▄▅▆▇█'[index%8]}
			</li>	
		{:then speechData}
			{#await speechData.arrayBuffer()}
			<span class="info" out:fade>╭</span>
			{:then arrayBuffer }	
			
					<li class="info" id='speech' use:assignAssets={{buffer: arrayBuffer, index }} 
					in:fly="{{ x: -200, duration: index * 200 }}" out:fade>
					╰ {data.speech.titles[index]}
					</li>
			
			{/await}
			 <h3 in:fly="{{ y: 200, duration: 3000 }}" out:fade>Ready.</h3>
		{/await}
{/each} -->