<script lang="ts">
	/**
	 * @description
	 * Parallel Assets Worker
	 */
	import type { LayoutData } from './$types';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import { Audio } from '$lib/classes/Audio';
	import { VFS_PATH_PREFIX, PlaylistMusic, SpeechCoreLoaded, MusicCoreLoaded } from '$lib/stores/stores';
	import { get } from 'svelte/store';
	import { VoiceOver } from '$lib/classes/Speech';
	import type { AssetCategories, StructuredAssetContainer } from '../typeDeclarations';
  import { fade, fly } from 'svelte/transition';

	export let data: LayoutData;
  
  $:hide = false
  const hideTimer = setTimeout(() => {
    hide = true;
  }, 5000);

	let structuredContainer: { music: StructuredAssetContainer; speech: StructuredAssetContainer } = {
		music: undefined,
		speech: undefined
	};
	  const prefix = get(VFS_PATH_PREFIX);

	 function assignAssets(node: HTMLElement, { buffer, index }) {
    
    const category:AssetCategories | string = node.id;
    const targetStateStore = category === 'music' ? MusicCoreLoaded : SpeechCoreLoaded;  
    if (category === 'music' || category === 'speech') {
		const asset = { path: data[category].paths[index], title: data[category].titles[index] };
	
		PlaylistMusic.update(($p) => {
      if ($p.titles[category].length >= data[category].titles.length) {
        return $p
      }
			$p.titles[category] = [...$p.titles[category], asset.title];
			return $p;
		});
    // assign
		structuredContainer[category] = {
			header: {
				title: asset.title,
				bytes: buffer.byteLength,
				globPath: asset.path,
				vfsPath: `${prefix}${asset.path}`
			},
			body: buffer
		};
    // update relevant VFS the first load
    const targetCore = category === 'music' ? Audio._core : VoiceOver._core; 
    Audio.updateVFS(structuredContainer[category], targetCore);
    }
  }
</script>

<div class='w-25% absolute top-28 left-5'>
	{#await data.musicStreamed.buffers}
		<div class="flex items-center">
			<ProgressBar height='h-1'/>
		</div>
	{:then musicBuffers}
  {#if !hide}
  <span class='info'>Music </span>
		{#each musicBuffers as buffer, index}
			<ul>
				<li class="info" id='music' use:assignAssets={{ buffer, index }} in:fly="{{ y: 200, duration: index * 200 }}" out:fade>
         ╰ {data.music.titles[index]}</li>
			</ul>
		{/each}
    {/if}
	{/await}


  {#await data.speechStreamed.buffers}
		<div class="flex items-center">
			<ProgressBar height='h-1'/>
		</div>
	{:then speechBuffers}
  {#if !hide}
  <span class='info'>Speech </span>
		{#each speechBuffers as buffer, index}
			<ul>
				<li class="info" id='speech' use:assignAssets={{ buffer, index }} in:fly="{{ y: 200, duration: index * 200 }}" out:fade>
           ╰ {$PlaylistMusic.titles.speech[index]}
			</ul>
		{/each}
    <h3 in:fly="{{ y: 200, duration: 3000 }}"  out:fade>Ready.</h3>
   {/if}
	{/await}
</div>
