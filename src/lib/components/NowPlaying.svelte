<script>
	import {PlaylistMusic} from '$lib/stores/stores';
	import {Audio} from '$lib/classes/Audio';
	import DescriptionList from './DescriptionList.svelte';
	import { fade } from 'svelte/transition';
	const { audioStatus } = Audio.stores

	$: isPlaying = $audioStatus === 'playing';
// @ts-ignore
	$: currentTrack = $PlaylistMusic.currentTrack.title.replace('.mp3' || '.ogg', '')	

</script>

		{#if Audio.buffersReady && isPlaying } 
				<DescriptionList {isPlaying} >
					 <span slot='Title' in:fade>
					  {currentTrack} (excerpt)				
					</span>		
					<span slot='Description' in:fade>{isPlaying ? 'Full album out now on all streaming platforms.' : ''}</span>
				</DescriptionList>
		{/if}
		



