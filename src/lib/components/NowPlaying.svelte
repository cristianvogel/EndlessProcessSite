<script>
	import {PlaylistMusic} from '$lib/stores/stores';
	import {Audio} from '$lib/classes/Audio';
	import DescriptionList from './DescriptionList.svelte';
	const { audioStatus } = Audio.stores

	$: isPlaying = $audioStatus === 'playing';
// @ts-ignore
	$: currentTrack = $PlaylistMusic.currentTrack.title.replace('.mp3' || '.ogg', '')	

</script>

		{#if Audio.audioBuffersReady  } 
				<DescriptionList {isPlaying}>
					 <span slot='Title'>
					{#if isPlaying}
					  {currentTrack}
					  {/if}
					</span>		
					<span slot='Description'>{isPlaying ? '(short excerpt) Full album out now on all streaming platforms.' : ''}</span>
				</DescriptionList>
		{/if}
		



