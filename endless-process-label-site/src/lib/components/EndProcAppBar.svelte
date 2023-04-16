<script lang="ts">
	import { fade } from 'svelte/transition';
	import { AppBar } from '@skeletonlabs/skeleton';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Events, ChartMarimekko, Cube, ProgressBarRound } from '@steeze-ui/carbon-icons';
	import ElementaryPlayer from '$lib/components/ElementaryPlayer.svelte';
	import Progress from '$lib/components/Progress.svelte';
	import { CablesText, CablesIsLoaded, PlaysCount, Playlist } from '$lib/stores/stores';
	import { Audio } from '$lib/classes/Audio';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const { audioStatus } = Audio.stores;

	$: audioBuffersReady = Audio.audioBuffersReady;

	/**
	 * @description ----------------------------------------------
	 * interactivity handler for the player controls
	 */
	function handleAudioControls(e: any) {
		// check if the click was on the playlist button

		if (e.currentTarget.id === 'playlist'){
			$Playlist.show = !$Playlist.show;
			dispatch('playlistChanged', $Playlist.show);
		}
		
		if (e.currentTarget.id === 'transport') {
			playPauseLogic();
		}
	}

	/**
	 * @description ----------------------------------------------
	 * what happens when the user presses the Play/Pause button
	 */
	function playPauseLogic() {
		if (!Audio.audioBuffersReady) {
			return;
		}
		// initialise first track data if this is the first play
		if ($PlaysCount === 0) { 
			$Playlist.currentTrack = {
										name: $Playlist.playlist[0], 
										path: $Playlist.playlist[0], 
										duration: $Playlist.durations.get($Playlist.playlist[0]), 
										progress: 0,
										offset: 0
									}
								$PlaysCount += 1; // todo: A modal prompting to buy the music after a number of plays ?
								}

		if ($audioStatus === 'playing') {
			Audio.pause();
			return;
		} else {
			Audio.unmute();
		}
	}
</script>

<AppBar
	background="bg-surface-800"
	gridColumns="grid-cols-3"
	slotTrail="place-content-end"
	slotLead="mb-0 h-10"
	regionRowHeadline="grid grid-cols-3"
>
	<svelte:fragment slot="lead" >
		<div class="flex flex-row gradient-text text-[1.618em] leading-none">
		<div class='basis-1/5'>
			<a href="/">{$CablesText[0]}</a>
			<a href="/"> {$CablesText[1]}</a>
		</div>	
		</div>
	
		<!-- Persistent Audio controls  -->
		{#if audioBuffersReady && $CablesIsLoaded}
			<ElementaryPlayer on:click={handleAudioControls} />
		{:else}
			<div class="absolute top-6" transition:fade>
				<Icon src={Cube} class="h-8 animate-spin" data-sveltekit-noscroll />
			</div>
		{/if}	
	</svelte:fragment>

	<!-- Persistent progress bar -->
	
		{#if audioBuffersReady && $CablesIsLoaded}
		<span transition:fade>
				<Progress/>
		</span>
		{/if}
		
	<!-- Persistent nav buttons -->
	<svelte:fragment slot="trail">
		<div class="flex justify-start">
			<a class="logo-item p-2 flex-none" href="/blog" data-sveltekit-noscroll>
				<Icon src={ChartMarimekko} class="h-7" />
				<span class='text-m'>Latest</span>
			</a>
			<a class="logo-item p-2 flex-none" href="/">
				<Icon src={ProgressBarRound} class="h-7" data-sveltekit-noscroll />
				<span class='text-m'>Catalogue</span>
			</a>
			<a class="logo-item p-2 flex-none" href="/">
				<Icon src={Events} class="h-7" data-sveltekit-noscroll />
				<span class='text-m'>Artists</span>
			</a>
		</div>
	</svelte:fragment>
</AppBar>
