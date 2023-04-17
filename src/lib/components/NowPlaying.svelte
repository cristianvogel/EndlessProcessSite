<script>
	import {Playlist} from '$lib/stores/stores';
	import {Audio} from '$lib/classes/Audio';
	import DescriptionList from './DescriptionList.svelte';
	const { audioStatus } = Audio.stores

	$: isPlaying = $audioStatus === 'playing';
	$: currentTrack = $Playlist.currentTrack.name;

</script>

		{#if Audio.audioBuffersReady  } 
				<DescriptionList {isPlaying}>
					 <span slot='Title'>
					{#if isPlaying}
					  {currentTrack}
					  {/if}
					</span>		
					<span slot='Description'>{isPlaying ? 'taken from the mindblowing new album.' : ''}</span>
				</DescriptionList>
		{/if}
		



