<script lang="ts">
	import { fade } from 'svelte/transition';
	import { AppBar } from '@skeletonlabs/skeleton';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { ChartRadial } from '@steeze-ui/carbon-icons';
	import ElementaryPlayer from '$lib/components/ElementaryPlayer.svelte';
	import Progress from '$lib/components/Progress.svelte';
	import { CablesIsLoaded, PlaysCount, PlaylistMusic, VFS_PATH_PREFIX, Decoded } from '$lib/stores/stores';
	import { AudioMain } from '$lib/classes/Audio';
	import { createEventDispatcher } from 'svelte';
	import { get } from 'svelte/store';
	import { handlePlaylistChoice } from '$lib/functions/handlePlaylistChoice';
	import NowPlaying from '$lib/components/NowPlaying.svelte';
	import TextToSpeech from '$lib/components/Speech/TextToSpeech.svelte';

	const dispatch = createEventDispatcher();

	const { audioStatus } = AudioMain.stores;

	$: audioBuffersReady = $Decoded.done;
	$: isPlaying = $audioStatus === 'playing';

	/**
	 * @description ----------------------------------------------
	 * interactivity handler for the player controls
	 */
	function handleAudioControls(e: any) {
		// check if the click was on the playlist button

		if (e.currentTarget.id === 'playlist'){
			$PlaylistMusic.show = !$PlaylistMusic.show;
			dispatch('playlistChanged', $PlaylistMusic.show);
		}
		
		if (e.currentTarget.id === 'transport') {
			playPauseLogic();
		}
	}

	/**
	 * @name playPauseLogic
	 * @description ----------------------------------------------
	 * what happens when the user presses the Play/Pause button
	 */
	function playPauseLogic() {
		if (!AudioMain.buffersReady) {
			return;
		}
		// initialise first track data if this is the first play
		if ($PlaysCount === 0) { 
			const firstTitle = $PlaylistMusic.titles?.music[0]
			$PlaylistMusic.currentTrack = {
										title: firstTitle, 
										vfsPath: get(VFS_PATH_PREFIX) + firstTitle, 
										duration: $PlaylistMusic.durations?.get(firstTitle as string), 
										progress: 0,
										offset: 0
									}
								$PlaysCount += 1; // todo: A modal prompting to buy the music after a number of plays ?
								}

								console.log('Cued track:', $PlaylistMusic.currentTrack?.title)

		if ($audioStatus === 'playing') {
			AudioMain.pause();
			return;
		} else {
			AudioMain.unmute();
		}
	}

	/**
	 * @name handleCueNext
	 * @description auto-cue functionality
	 * 
	*/
	function handleCueNext(e: CustomEvent<any>): void {
		const playlist = $PlaylistMusic.titles.music
		const end = playlist.length
		const nextIndex = (playlist.indexOf(e.detail) + 1) % end
		console.log('Next track:', playlist[nextIndex])
		handlePlaylistChoice(undefined, playlist[nextIndex])
	}

</script>


<AppBar
	background="endproc-card-bg"
	border="-mb-2"
	gridColumns="grid-cols-3 grid-rows-1 grid-flow-col"

	slotLead="grid md:grid-cols-4 sm:grid-cols-2 grid-rows-1 gap-2"
	slotDefault="grid grid-cols-1 grid-rows-1 grid-flow-col pt-2.5"
	slotTrail="grid grid-cols-1"

	regionRowHeadline="indent-10 z-10"
>
	<svelte:fragment slot="lead" >

		<!-- Persistent Audio controls  -->
		{#if audioBuffersReady && $CablesIsLoaded}
			<ElementaryPlayer on:click={handleAudioControls} />
		{:else}
			<span class='text-lg text-secondary-600 animate-spin -pl-20' data-sveltekit-noscroll>
				<Icon src={ChartRadial} class="h-10" />
			</span>
		{/if}	
		

	</svelte:fragment>

	<NowPlaying show={ audioBuffersReady && $CablesIsLoaded && isPlaying} />	

	<!--  progress bar -->
	<svelte:fragment slot="headline">
		{#if audioBuffersReady && $CablesIsLoaded}
		<span transition:fade>
				<Progress on:cueNext={handleCueNext}/>
		</span>
		{/if}
		</svelte:fragment>


	<!--  nav buttons -->
	<svelte:fragment slot="trail">
		<div class='absolute info md:top-24 sm:top-30 right-20 '>
			<TextToSpeech/>
		</div>
		<div class="place-content-end col-start-2 
		border-2 border-surface-700 rounded-lg
		w-full">
			<a class="logo-item p-1 mx-5" href="/blog" data-sveltekit-noscroll>
				<span class='text-m'>Posts</span>
			</a>
		</div>
	</svelte:fragment>
</AppBar>

<style>
	.logo-item {
		background-color: transparent;
	}
</style>