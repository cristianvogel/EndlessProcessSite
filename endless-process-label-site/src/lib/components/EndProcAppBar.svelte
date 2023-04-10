
<script lang="ts">
import { AppBar } from "@skeletonlabs/skeleton";
	import { Icon } from '@steeze-ui/svelte-icon';
	import { LogoDiscord, ChartMarimekko, ProgressBarRound } from '@steeze-ui/carbon-icons';
	import ElementaryPlayer from '$lib/components/ElementaryPlayer.svelte';
    import { CablesText } from '$lib/stores/stores';
    import { Audio } from '$lib/stores/AudioEngine';

    const { audioStatus } = Audio.stores;
    const { resumeContext, mute, unmute } = Audio;

    $: isPlaying = $audioStatus === 'playing';
	$: showPlaylist = false;

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

<AppBar background="bg-opacity-50 bg-surface-800">
			<svelte:fragment slot="lead">
				<div
					class="font-bold bg-gradient-to-br from-red-500 to-yellow-500 bg-clip-text text-transparent box-decoration-clone"
				>
					<a href="/" class="text-xl pr-6">{$CablesText[0]}{$CablesText[1]}</a>
				</div>
				<span class="divider-vertical h-10" />
			</svelte:fragment>

			<!-- Persistent Audio controls  -->
			<ElementaryPlayer on:click={handleAudioControls} {showPlaylist} />

			<!-- Persistent nav buttons -->
			<svelte:fragment slot="trail">
				<div class="flex justify-start">
					<a class="logo-item w-200 p-2" href="/blog" data-sveltekit-noscroll>
						<Icon src={ChartMarimekko} class="h-8" />
						<span>Latest</span>
					</a>
					<a class="logo-item p-2 " href="/">
						<Icon src={ProgressBarRound} class="h-8" data-sveltekit-noscroll />
						<span>Releases</span>
					</a>
					<a class="logo-item p-2 " href="/">
						<Icon src={LogoDiscord} class="h-8" data-sveltekit-noscroll />
						<span>Artists</span>
					</a>
				</div></svelte:fragment
			>
		</AppBar>