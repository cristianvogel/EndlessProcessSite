<script lang="ts">
	import { Audio } from '$lib/stores/AudioEngine';
	import { Icon } from '@steeze-ui/svelte-icon';
	import {PauseOutline, PlayOutline, QueryQueue } from '@steeze-ui/carbon-icons';
	import { Decoding, Playlist } from '$lib/stores/stores';
	import PlaylistView from './PlaylistView.svelte';

	const { audioStatus } = Audio.stores
	
	let tracklisting:Array<string>;

	$: tracklisting = $Playlist.playlist;
	$: isPlaying = $audioStatus === 'playing';

</script>

{#if ($audioStatus !==  'loading' || 'closed ') && ($Decoding.done) }
	<div class="grid grid-cols-2 gap-2 z-10 flex-none">	
	
	<button class= { isPlaying ? 
	' rounded-full bg-surface-700 p-1 items-center' :
	' rounded-full bg-surface-700 p-1 items-center' }
	id='transport'
	on:click >
		<Icon src= { isPlaying ? PauseOutline : PlayOutline } 
		class={ isPlaying ? 
		'h-8 fill-secondary-200' : 
		'h-8 fill-secondary-300 animate-pulse' }
		data-sveltekit-noscroll />
	</button>
	<button class="rounded-full p-2 bg-surface-700  items-center" id='playlist' on:click >
		<Icon src={QueryQueue} class="h-6 rotate-180 fill-secondary-300" data-sveltekit-noscroll />
	</button>
	{#if $Playlist.show}
		<!-- Playlist -->
		<div class="absolute top-10 indent-x-10 bg-surface-700 p-3 text-s text-tertiary-800">
			<PlaylistView {tracklisting}  />
		</div>
	{/if}
	</div>
{/if}
