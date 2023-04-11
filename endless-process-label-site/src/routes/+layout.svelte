<script lang="ts">
	// @Skeleton: The ordering of these imports is critical to your app working properly
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	// Custom Skeleton theme:
	import '../theme.postcss';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';
	import { AppShell } from '@skeletonlabs/skeleton';
	import EndProcAppBar from '$lib/components/EndProcAppBar.svelte';
	import SplashPage from '$lib/components/SplashPage.svelte';
	import PageFooter from '$lib/components/Footer.svelte';
	import CanvasBody from '$lib/components/CanvasBody.svelte';

	$: spin = false;

	/**
	 * @description ----------------------------------------------
	 * a special interactive effect for the Cables canvas
	 * triggers a spin animation via store subscription on page scrolling
	*/
	function cablesScroller() {
		spin = true;
		setTimeout(() => {
			spin = false;
		}, 100);
	}

	function spinFX() {
			// todo: more exagerrated spin effect
			// sent into Cables page
	}

</script>

<!-- todo: fallback styling in case of no Canvas... 
	class="h-full p-1 bg-gradient-to-br from-slate-500 to-stone-800" 
-->

<AppShell class=" p-1 bg-transparent" on:scroll={cablesScroller}>
	
	<!--  Appbar in Skeleton header slot -->
	<svelte:fragment slot="header">
		<EndProcAppBar on:playlistChanged={spinFX}/>
	</svelte:fragment>

	<!-- Cables canvas in Skeleton header slot -->
	<svelte:fragment slot="pageHeader">
		<CanvasBody spin = {spin} />
	</svelte:fragment>

	<SplashPage />
	<slot />

	<!-- Page footer in Skeleton footer slot -->
	<svelte:fragment slot="footer">
		<PageFooter />
	</svelte:fragment>

</AppShell>
