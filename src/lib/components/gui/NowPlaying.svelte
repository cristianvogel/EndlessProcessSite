<script lang='ts'>
	import { PlaylistMusic, RendererStatus } from '$lib/stores/stores';
	import { fade } from 'svelte/transition';
	import DescriptionList from '$lib/components/gui/DescriptionList.svelte';
	

	export let show:boolean = false;

	$: isPlaying = $RendererStatus.music === 'playing';
// @ts-ignore
	$: currentTrack = $PlaylistMusic.currentTrack.title.replace('.mp3' || '.ogg', '')	

</script>
	<DescriptionList {show} >
			<span slot='Title' in:fade>
			{currentTrack} (excerpt)				
		</span>		
		<span slot='Description' in:fade>{isPlaying ? 'Full album out now on all streaming platforms.' : ''}</span>
	</DescriptionList>

		
