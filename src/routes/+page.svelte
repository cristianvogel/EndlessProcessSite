<script lang="ts">
	/**
	 * @description
	 * Parallel Assets Worker
	 */
	import type { LayoutData } from './$types';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import { VFS_PATH_PREFIX, PlaylistMusic, Decoded, VFS_Entries_Music, VFS_Entries_Speech } from '$lib/stores/stores';
	import { get } from 'svelte/store';
	import { VoiceOver } from '$lib/classes/Speech';
	import type { AssetCategories, StructuredAssetContainer } from '../typeDeclarations';
  	import { fade, fly } from 'svelte/transition';

	export let data: LayoutData;
  
	$:hide = false
	
	const hideTimer = setTimeout(() => {
		hide = true;
		$Decoded.done = true
	}, 5000);
  
	let structuredContainer: { music: StructuredAssetContainer; speech: StructuredAssetContainer } = {
		music: undefined,
		speech: undefined
	};
	  const prefix = get(VFS_PATH_PREFIX);

 function assignAssets(node: HTMLElement, params: { buffer: ArrayBuffer; index: number }) {
		const { buffer, index } = params;
		const category:AssetCategories | string = node.id;
		if (category === 'music' || category === 'speech') {
			const asset = { path: data[category].paths[index], title: data[category].titles[index] };
			PlaylistMusic.update(($p) => {
				if ($p.titles[category].length >= data[category].titles.length) {
					return $p
				}
				$p.titles[category] = [...$p.titles[category], asset.title];
				return $p;
			});
			
			structuredContainer[category] = {
				header: {
					title: asset.title,
					bytes: buffer.byteLength,
					globPath: asset.path,
					vfsPath: `${prefix}${asset.path}`
				},
				body: buffer
			};
		// add the VFS entry to the dictionery for later assignment
		// when we are absolutely sure the Elementary core is ready
		if (category === 'music') {
			VFS_Entries_Music.update(($v) => {
				$v = [...$v, structuredContainer['music']];
				return $v;
			});
		} else {
			VFS_Entries_Speech.update(($v) => {
				$v = [...$v, structuredContainer['speech']];
				return $v;
			});
		}
	}
}
</script>

{#if !$Decoded.done}
<div class='fileinfo' in:fade>
	<ul>
	{#each data.musicStreamed.buffers as promising, index}
	   {#await Promise.resolve(promising)}
			<li class="text-md text-secondary-300" in:fly="{{ y: 200, duration: index * 100 }}">
					{'┄┉┈━┅─┿╂'[index%8]}
			</li> 	
		{:then musicData}
			{#await musicData.arrayBuffer()}
				<li class="text-sm text-secondary-600" in:fly="{{ y: 200, duration: index * 100 }}" out:fade>
					{'▁▂▃▄▅▆▇█'[index%8]}
				</li>
			{:then arrayBuffer }	
					<li class="info" id='music' use:assignAssets={{buffer: arrayBuffer, index }} 
					in:fly="{{ x: -200, duration: index * 200 }}" out:fade>
					╰ {data.music.titles[index]}
					</li>
			{/await}
		{/await}
	{/each}
	
{#each data.speechStreamed.buffers as promising, index }
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
{/each}
 
</ul>
</div>

{/if}


<style>
	.fileinfo {
		position: absolute;
		left: 1rem;
		top: 10rem;
	}
</style>