<script lang="ts">

	/**
	* @todo fallback styling in case of no Canvas... 
	* class="h-full p-1 bg-gradient-to-br from-slate-500 to-stone-800" 
	**/

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
	 * @name cablesScroller
	 * @description
	 * a cool interactive effect for the Cables canvas
	 * triggers a spin animation on page scrolling
	*/
	function cablesScroller() {
		spin = true;
		setTimeout(() => {
			spin = false;
		}, 100);
	}

	function canvasFX() {
			// todo: more exagerrated user triggered FX
			// sent into Cables page
	}

</script>

<AppShell class="p-1 bg-transparent" on:scroll={cablesScroller}>
	<!--  Appbar in Skeleton header slot -->
	<svelte:fragment slot="header">
		<EndProcAppBar on:playlistChanged={canvasFX}/>
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


