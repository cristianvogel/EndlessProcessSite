<script lang='ts'>
	import {PlaylistMusic} from '$lib/stores/stores';
	import {Audio} from '$lib/classes/Audio';
	import DescriptionList from './DescriptionList.svelte';
	import { fade } from 'svelte/transition';
	const { audioStatus } = Audio.stores

	export let show:boolean = false;

	$: isPlaying = $audioStatus === 'playing';
// @ts-ignore
	$: currentTrack = $PlaylistMusic.currentTrack.title.replace('.mp3' || '.ogg', '')	

</script>
	<DescriptionList {show} >
			<span slot='Title' in:fade>
			{currentTrack} (excerpt)				
		</span>		
		<span slot='Description' in:fade>{isPlaying ? 'Full album out now on all streaming platforms.' : ''}</span>
	</DescriptionList>

		
