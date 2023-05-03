<script>
	import {PlaylistMusic} from '$lib/stores/stores';
	import {Audio} from '$lib/classes/Audio';
	import DescriptionList from './DescriptionList.svelte';
	const { audioStatus } = Audio.stores

	$: isPlaying = $audioStatus === 'playing';
// @ts-ignore
	$: currentTrack = $PlaylistMusic.currentTrack.title.replace('.mp3' || '.ogg', '')	

</script>

		{#if Audio.buffersReady  } 
				<DescriptionList {isPlaying}>
					 <span slot='Title'>
					{#if isPlaying}
					  {currentTrack} (excerpt)
					  {/if}
					</span>		
					<span slot='Description'>{isPlaying ? 'Full album out now on all streaming platforms.' : ''}</span>
				</DescriptionList>
		{/if}
		



