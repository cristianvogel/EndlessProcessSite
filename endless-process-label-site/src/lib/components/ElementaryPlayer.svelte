<script lang="ts">
	import { Audio } from '$lib/stores/AudioEngine';
	import { Icon } from '@steeze-ui/svelte-icon';
	import {PauseOutline, PlayOutline, QueryQueue } from '@steeze-ui/carbon-icons';
	import { Decoding, Playlist, VFS_PATH_PREFIX } from '$lib/stores/stores';
	import PlaylistView from './PlaylistView.svelte';
	const { audioStatus } = Audio.stores
	
	export let showPlaylist = false;
	
	let tracklisting:Array<string>;

	$: tracklisting = $Playlist.playlist;
	$: isPlaying = $audioStatus === 'playing';

	function HandlePlaylistChoice(e:any) {
		showPlaylist = false;
		Audio.playFromVFS( { trigger: 0 });
		Playlist.update( (plist) => {
			const currentTrack = plist.currentTrack;
			plist.currentTrack = {
				...currentTrack, 
				duration: plist.durations.get(e.currentTarget.name), 
				name: e.currentTarget.name,
			path: $VFS_PATH_PREFIX+e.currentTarget.name,
				progress: 0,
			};
				console.log('Current track from store: ',plist.currentTrack);
			return plist;
		});
		
		Audio.playFromVFS( { trigger: 1 });
	}
		

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
	{#if showPlaylist}
		<!-- Playlist -->
		<div class="absolute top-10 indent-x-10 bg-surface-700 p-3 text-s text-tertiary-800">
			<PlaylistView {tracklisting} 
			on:click={HandlePlaylistChoice} />
		</div>
	{/if}
	</div>
{/if}
