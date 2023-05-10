<script lang="ts">
	/**
	 * @description
	 * Parallel Assets Worker
	 */
	import type { PageData } from './$types';
	import { VFS_PATH_PREFIX, PlaylistMusic, Decoded, VFS_Entries_Music, VFS_Entries_Speech, MusicAssetsReady } from '$lib/stores/stores';
	import { get } from 'svelte/store';
	import { Audio } from '$lib/classes/Audio';
	import type { AssetCategories, AudioAssetMetadata, StructuredAssetContainer } from '../typeDeclarations';
  	import { fade, fly } from 'svelte/transition';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import { tick } from 'svelte';

	
	export let data: PageData;
	let assetsCollectionSize:number;
	let hideTimer
	

	$:hide = false;
	$:assetsCollectionSize = 0;
	$:ready = false;
	$:tick().then( () => {ready = (assetsCollectionSize > 0) ? ($VFS_Entries_Music.length > assetsCollectionSize-1) : false}  )
	$:if (!ready) {
				
				const vfs:Array<StructuredAssetContainer> = $VFS_Entries_Music;		    	
				vfs.forEach(entry => {
					console.log( 'VFS updated with ▶︎ ',entry?.header.title )
					Audio.updateVFS(entry, Audio._core);
				})}
	$: if (ready) { 
		$Decoded.done = true;  
		hideTimer = setTimeout(() => {
		hide = true;
	}, 3 * 1.0e3 )
}
	
	
 

	let structuredContainer: { music: StructuredAssetContainer; speech: StructuredAssetContainer } = {
		music: undefined,
		speech: undefined
	};
	  const prefix = get(VFS_PATH_PREFIX);

 function assignAssets(element: HTMLElement, params: { assetContainer: AudioAssetMetadata; index: number; sum: number }) {

		
		const { assetContainer, index, sum } = params;
		const { mediaItemUrl, title, caption, fileSize, buffer } = assetContainer;
		assetsCollectionSize = sum
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
		// add the VFS entry to the dictionary for later assignment when we are absolutely sure the everything is ready
		if (category === 'music') {
			VFS_Entries_Music.update(($v) => {
				console.log( 'storing =-> ',structuredContainer['music'] )
				$v = [...$v, structuredContainer['music']];
				return $v;
			});
		} 
		
		

		/**
		* @todo get Speech working again
		**/	
		// else {
		// 	VFS_Entries_Speech.update(($v) => {
		// 		$v = [...$v, structuredContainer['speech']];
		// 		return $v;
		// 	});
		// }
	
	}
}
	function stripTags(inputHTML: string): string | null {
		const parser = new DOMParser();
		const doc: Document = parser.parseFromString(inputHTML, 'text/html');
		const strippedHTML = doc.body.textContent;
		return strippedHTML;
}
</script>

{#if !hide && !$Decoded.done}

<ul><div class='fileinfo' in:fade>
	{#await (data.streamedMetaData.metadata)}
	<div in:fade><h2>Initialising.</h2></div>
	{:then responseObject}
	{@const sum = assetsCollectionSize = responseObject.data.mediaItems.edges.length}
	<div out:fade><h3>{ready ?" Ready." : "Fetching Endproc Playlist."}</h3></div>
	<ProgressBar value={$VFS_Entries_Music.length}  max={sum} />
    {#each responseObject.data.mediaItems.edges as edge, index}
		{#await fetch(edge.node.mediaItemUrl, 
			{
				method:'GET', 
				headers: {'Content-Type': 'audio/*' }
			}
		)}
		<li><span class='h2'>Edge {index} of {sum}.</span></li>
		{:then responseObject}

			{#await responseObject.arrayBuffer()}
			<span class='h3' out:fade>Loading Audio. <ProgressBar height='h-1'/></span> 
			{:then buffer}
				{@const loadedArrayBuffer = buffer}
				<span class='h4'>{buffer.byteLength}</span>
				{@const caption = stripTags( edge.node.caption )}
				<li class= 'info' id= 'music' use:assignAssets={{assetContainer: {...edge.node, category: 'music', buffer: loadedArrayBuffer}, index, sum }}
					in:fly="{{ x: -200, duration: index * 200 }}" 
					out:fade>
					{`${edge.node.title} ${edge.node.fileSize} bytes`}<br/>
					╰{ @html (caption? caption : 'no detail') } <br/>
					{`╰ ${edge.node.mediaItemUrl}`}<br/>
				</li>	
			{:catch error} 
			<span class='h4'>error1: {error}</span>
			{/await}
	
		{/await}
	{/each}
			{:catch error} 
			<span class='h4'>error2: {error}</span>
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