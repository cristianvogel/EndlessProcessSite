<script lang="ts">
	import { fade } from 'svelte/transition';
	import { AppBar } from '@skeletonlabs/skeleton';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Cube } from '@steeze-ui/carbon-icons';
	import ElementaryPlayer from '$lib/components/ElementaryPlayer.svelte';
	import Progress from '$lib/components/Progress.svelte';
	import { CablesIsLoaded, PlaysCount, PlaylistMusic, VFS_PATH_PREFIX, SpeechCoreLoaded, MusicCoreLoaded, Decoded } from '$lib/stores/stores';
	import { Audio } from '$lib/classes/Audio';
	import { createEventDispatcher } from 'svelte';
	import { get } from 'svelte/store';
	import { handlePlaylistChoice } from '$lib/functions/handlePlaylistChoice';
	import NowPlaying from './NowPlaying.svelte';
	import TextToSpeech from './Speech/TextToSpeech.svelte';

	const dispatch = createEventDispatcher();

	const { audioStatus } = Audio.stores;

	$: audioBuffersReady = $Decoded.done;


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
		if (!Audio.buffersReady) {
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
			Audio.pause();
			return;
		} else {
			Audio.unmute();
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
	slotTrail="place-content-end"
	slotLead="grid grid-cols-2 grid-rows-1 gap-2"
	slotDefault="justify-center"
	regionRowHeadline="indent-10 z-10"
>
	<svelte:fragment slot="lead" >

		<!-- Persistent Audio controls  -->
		{#if audioBuffersReady && $CablesIsLoaded}
			<ElementaryPlayer on:click={handleAudioControls} />
		{:else}
			<span class='text-lg text-secondary-600 animate-pulse' data-sveltekit-noscroll>Loading.</span>
		{/if}	
		

	</svelte:fragment>
		{#if audioBuffersReady && $CablesIsLoaded}
		<NowPlaying />	
		{/if}
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
		<div class="flex justify-end flex-wrap">

			<a class="logo-item p-2" href="/blog" data-sveltekit-noscroll>
				<!-- <Icon src={ChartMarimekko} class="h-4" /> -->
				<hr class="h-1 w-2 divider-vertical bg-surface-400" />
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