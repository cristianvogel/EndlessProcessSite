<script lang="ts">
	import { fade } from 'svelte/transition';
	import { AppBar } from '@skeletonlabs/skeleton';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Events, ChartMarimekko, Cube, ProgressBarRound } from '@steeze-ui/carbon-icons';
	import ElementaryPlayer from '$lib/components/ElementaryPlayer.svelte';
	import { CablesText, CablesIsLoaded } from '$lib/stores/stores';
	import { Audio } from '$lib/stores/AudioEngine';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();


	const { audioStatus } = Audio.stores;
	const { resumeContext, mute, unmute } = Audio;

	$: isPlaying = $audioStatus === 'playing';
	$: showPlaylist = false;
	$: audioBuffersReady = Audio.audioBuffersReady;

	/**
	 * @description ----------------------------------------------
	 * interactivity handler for the Audio controls
	 */
	function handleAudioControls(e: any) {
		// check if the click was on the playlist button
		if (e.currentTarget.id !== 'playlist') {
			showPlaylist = false;
		} else {
			showPlaylist = !showPlaylist;
			dispatch('playlistChanged', showPlaylist);
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
		if ($audioStatus === 'suspended' || 'closed' || 'loading') {
			resumeContext();
		}
		if (isPlaying) {
			mute();
		} else {
			unmute();
		}
	}
</script>

<AppBar
	background="bg-opacity-50 bg-surface-800"
	gridColumns="grid-cols-3"
	slotDefault="place-self-center"
	slotTrail="place-content-end"
>
	<svelte:fragment slot="lead" >
		<div class="gradient-text text-xl">
			<a href="/">{$CablesText[0]}</a><a href="/"> {$CablesText[1]}</a>
		</div>
		
		<!-- Persistent Audio controls  -->
		{#if audioBuffersReady && $CablesIsLoaded}
			<ElementaryPlayer on:click={handleAudioControls} {showPlaylist} />
		{:else}
			<div class="absolute top-6" transition:fade>
				<Icon src={Cube} class="h-8 animate-spin" data-sveltekit-noscroll />
			</div>
		{/if}
		
	</svelte:fragment>
	
	<!-- Persistent nav buttons -->
	<svelte:fragment slot="trail">
		<div class="flex justify-start">
			<a class="logo-item p-2 flex-none" href="/blog" data-sveltekit-noscroll>
				<Icon src={ChartMarimekko} class="h-7" />
				<span class='text-m'>Latest</span>
			</a>
			<a class="logo-item p-2 flex-none" href="/">
				<Icon src={ProgressBarRound} class="h-7" data-sveltekit-noscroll />
				<span class='text-m'>Releases</span>
			</a>
			<a class="logo-item p-2 flex-none" href="/">
				<Icon src={Events} class="h-7" data-sveltekit-noscroll />
				<span class='text-m'>Artists</span>
			</a>
		</div>
	</svelte:fragment>
</AppBar>
