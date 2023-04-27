<script lang="ts">
	/**
	 * @description
	 * Parallel Assets Worker
	 */
	import type { LayoutData } from './$types';
  import { ProgressBar } from '@skeletonlabs/skeleton';
	import { Audio } from '$lib/classes/Audio';
	import type { ArrayBufferContainer } from '../typeDeclarations';
	import {VFS_PATH_PREFIX, 
          PlaylistMusic, 
          MusicCoreLoaded, 
          SpeechCoreLoaded } from '$lib/stores/stores';
	import { get } from 'svelte/store';
	import { VoiceOver } from '$lib/classes/Speech';


	export let data: LayoutData
  let buffer;
  const prefix = get(VFS_PATH_PREFIX);

  function update(node: HTMLElement, {buffer, index}) {

    const path_music =  data.music.paths[index]
    const title_music  = data.music.titles[index]
    const path_speech =  data.speech.paths[index]
    const title_speech  = data.speech.titles[index]

    PlaylistMusic.update(($p) => {
              $p.titles.music = data.music.titles;
              $p.titles.speech = data.speech.titles;
              return $p;
            });

    // music
    let structuredContainer: ArrayBufferContainer = {
          header: {
            title: title_music,
            bytes: buffer.byteLength,
            globPath: data.music.paths[index],
            vfsPath: `${prefix}${path_music}`
          },
          body: buffer
        };

   Audio.updateVFS(structuredContainer, Audio._core ); 

    // speech
    structuredContainer = {
          header: {
            title: title_speech,
            bytes: buffer.byteLength,
            globPath: data.music.paths[index],
            vfsPath: `${prefix}${path_speech}`
          },
          body: buffer
        };     

   Audio.updateVFS(structuredContainer, VoiceOver._core ); 
   
  }
  

</script>
<div class='absolute top-28 left-5 w-25%'>
{#each data.music.paths as path}
<ul>
 <li class='info'>{path}</li> 
</ul>
{/each}


{#await (data.streamed.buffers)}
 <div class='flex items-center'>
  <span class='info'>Loading audio</span>
  <ProgressBar />
  </div>
{:then allBuffers} 
  {#each allBuffers as buffer, index}
  <ul>
  <li class='info' use:update={{buffer, index}}>{buffer.byteLength}</li> 
  </ul>
  {/each}
{/await}
</div>