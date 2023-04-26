<script lang="ts">
	import { fade } from 'svelte/transition';
	import { AppBar } from '@skeletonlabs/skeleton';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Cube } from '@steeze-ui/carbon-icons';
	import ElementaryPlayer from '$lib/components/ElementaryPlayer.svelte';
	import Progress from '$lib/components/Progress.svelte';
	import { CablesText, CablesIsLoaded, PlaysCount, PlaylistMusic, VFS_PATH_PREFIX } from '$lib/stores/stores';
	import { Audio } from '$lib/classes/Audio';
	import { createEventDispatcher } from 'svelte';
	import { get } from 'svelte/store';

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
			$PlaylistMusic.show = !$PlaylistMusic.show;
			dispatch('playlistChanged', $PlaylistMusic.show);
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
			const firstTitle = $PlaylistMusic.titles.music[0]
			$PlaylistMusic.currentTrack = {
										title: firstTitle, 
										vfsPath: get(VFS_PATH_PREFIX) + firstTitle, 
										duration: $PlaylistMusic.durations.get(firstTitle), 
										progress: 0,
										offset: 0
									}
								$PlaysCount += 1; // todo: A modal prompting to buy the music after a number of plays ?
								}

								console.log('Cued track:', $PlaylistMusic.currentTrack.title)

		if ($audioStatus === 'playing') {
			Audio.pause();
			return;
		} else {
			Audio.unmute();
		}
	}
</script>


<AppBar
	background="endproc-card-bg"
	gridColumns="grid-cols-3"
	slotTrail="place-content-end"
	slotLead="mb-0 h-10"
	regionRowHeadline="indent-10"
>
	<svelte:fragment slot="lead" >

	
		<!-- Persistent Audio controls  -->
		{#if audioBuffersReady && $CablesIsLoaded}
			<ElementaryPlayer on:click={handleAudioControls} />
		{:else}
			<div class="absolute top-6" transition:fade>
				<Icon src={Cube} class="h-10 animate-spin" data-sveltekit-noscroll />
			</div>
		{/if}	
		

	</svelte:fragment>
		<!-- legend -->
		<div class="flex flex-wrap gradient-text place-content-center">
			<div class='basis-1/2 text-2xl leading-6 '>
				<a href="/">{$CablesText[0]}{$CablesText[1]}</a>
			</div>	
		</div>
	<!-- Persistent progress bar -->
	<svelte:fragment slot="headline">
		{#if audioBuffersReady && $CablesIsLoaded}
		<span transition:fade>
				<Progress/>
		</span>
		{/if}
		</svelte:fragment>


	<!-- Persistent nav buttons -->
	<svelte:fragment slot="trail">
		<div class="flex justify-end flex-wrap">
			<a class="logo-item p-2" href="/blog" data-sveltekit-noscroll>
				<!-- <Icon src={ChartMarimekko} class="h-4" /> -->
				<hr class="h-1 w-2 divider-vertical bg-surface-400" />
				<span class='text-m'>Posts</span>
			</a>
			<!-- <a class="logo-item p-2 " href="/">
				<hr class="h-1 w-2 divider-vertical bg-surface-400 " />
				<span class='text-m'>Music</span>
			</a>
			<a class="logo-item p-0 " href="/">
				<hr class="h-1 w-2 divider-vertical bg-surface-400" />
				<span class='text-m'>Artists</span>
			</a> -->
		</div>
	</svelte:fragment>
</AppBar>

<style>
	.logo-item {
		background-color: transparent;
	}
</style>