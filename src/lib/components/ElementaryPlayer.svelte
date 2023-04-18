<script lang="ts">
	import { Audio } from '$lib/classes/Audio';
	import { Icon } from '@steeze-ui/svelte-icon';
	import {PauseOutline, PlayOutline, QueryQueue } from '@steeze-ui/carbon-icons';
	import { Decoding, Playlist } from '$lib/stores/stores';
	import PlaylistView from './PlaylistView.svelte';

	const { audioStatus } = Audio.stores
	
	let clickListenerRegistered = false;
	let tracklisting:Array<string>;

	$: tracklisting = $Playlist.playlist;
	$: isPlaying = $audioStatus === 'playing';

	function forceAudioContextResume() {
      if (clickListenerRegistered) {
       return
      } else {
		 Audio.resumeContext()
        clickListenerRegistered = true;
      }
  	};


</script>

<svelte:window on:mousedown={forceAudioContextResume}/>

{#if ($audioStatus !==  'loading' || 'closed ') && ($Decoding.done) }
	<div class="flex flex-row gap-4 basis-1/2 z-10 ">	
	
	<button class= { isPlaying ? 
	' rounded-full bg-surface-700 p-1 items-center basis-1/8 shrink-0' :
	' rounded-full bg-surface-700 p-1 items-center basis-1/8 shrink-0' }
	id='transport'
	on:click >
		<Icon src= { isPlaying ? PauseOutline : PlayOutline } 
		class={ isPlaying ? 
		'h-8 fill-secondary-200' : 
		'h-8 fill-secondary-300 animate-pulse' }
		data-sveltekit-noscroll />
	</button>
	<button class="rounded-full p-2 bg-surface-700 basis-1/8 shrink-0 items-center" id='playlist' on:click >
		<Icon src={QueryQueue} class=" h-8 rotate-180 fill-secondary-300" data-sveltekit-noscroll />
	</button>
	{#if $Playlist.show}
		<!-- Playlist -->
		<div class="absolute top-10 indent-x-10 bg-surface-700 p-3 text-s text-tertiary-800">
			<PlaylistView {tracklisting}  />
		</div>
	{/if}
	</div>
{/if}
