<script lang="ts">
	// @Skeleton: The ordering of these imports is critical to your app working properly
	// Your custom Skeleton theme:
	import '../theme.postcss';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/all.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';
	//import skeletonUI components
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	//import steeze-ui icon component
	import { Icon } from '@steeze-ui/svelte-icon';
	import { LogoDiscord, ChartMarimekko, ProgressBarRound, Asterisk } from '@steeze-ui/carbon-icons';
	import ElementaryPlayer from '$lib/components/ElementaryPlayer.svelte';
	import { CablesAudioFileURL, CablesPatch, ElementaryAudioEngine as AudioEngine, audioStatus } from '$lib/stores/stores';




let isPlaying: boolean = false;
	$: isPlaying = ($audioStatus === 'running')

	function handleAudioButtonClick( ) {
		console.log('handleAudioButtonClick from button -> ', isPlaying);
		 if ($AudioEngine.state !== 'running') { $AudioEngine.resume(); }
		if (isPlaying) {
			$AudioEngine.muteAndSuspend();
		} else {
			$AudioEngine.unmute();
		}
	}


</script>



<!-- App Shell -->
<AppShell
	class="h-full p-1 bg-gradient-to-br from-slate-500 to-stone-800"
	slotSidebarLeft="grid grid-cols-1"
	slotSidebarRight="grid grid-cols-1"
	slotPageContent="grid grid-cols-1"
>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar background="bg-surface-800">
			<svelte:fragment slot="lead">
				<div
					class="font-bold bg-gradient-to-br from-red-500 to-yellow-500 bg-clip-text text-transparent box-decoration-clone"
				>
					<a href="/" class="text-xl pr-6">endless</a>
					<a href="/" class="text-xl pr-10">ssǝɔoɹd</a>
				</div>
				<span class="divider-vertical h-10" />
			</svelte:fragment>
			
			
			<ElementaryPlayer on:mousedown={handleAudioButtonClick}/>
			{#if $CablesPatch}
				<Icon src={Asterisk} class="h-2 animate-pulse" /><span class='text-sm'>Patch initialised : Playing {$CablesAudioFileURL}</span>
			{/if}
			

			<svelte:fragment slot="trail">
				<div class="flex justify-start">
					<a class="logo-item w-200 p-2" href="/blog">
						<Icon src={ChartMarimekko} class="h-8" />
						<span>Latest</span>
					</a>
					<a class="logo-item p-2 " href="/">
						<Icon src={ProgressBarRound} class="h-8" />
						<span>Releases</span>
					</a>
					<a class="logo-item p-2 " href="/">
						<Icon src={LogoDiscord} class="h-8" />
						<span>Artists</span>
					</a>
				</div></svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<svelte:fragment slot="footer">
		<div
			class="card variant-soft p-2 m-0.5 flex justify-center items-center overflow-hidden text-xs"
		>
			Endless Process © 2023
		</div>
	</svelte:fragment>
	<slot />
</AppShell>
