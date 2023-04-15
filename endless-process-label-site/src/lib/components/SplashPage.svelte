<script>
	// Splash opening
	import SplashSVG from '$lib/components/SplashSVG.svelte';
	import NowPlaying from './NowPlaying.svelte';
	import {Audio} from '$lib/classes/Audio';
	import { singlePost } from '$lib/stores/stores';
	import FolderScan from '$lib/components/FolderScan.svelte';
	import TextToSpeech from '$lib/components/Speech/TextToSpeech.svelte';
	const { audioStatus } = Audio.stores

	$: splash =  ( $audioStatus !== 'playing') ? !$singlePost.isOpen : false;

</script>
	<div class='absolute info top-20 left-3 -z-10'><FolderScan /></div>
	<div class='absolute info top-20 right-1 -mt-2'><TextToSpeech/></div>

<div class="container mx-auto my-2 w-[30%] flex-none" on:mousedown>
	<div class="space-y-10 text-center">
		{#if splash}
		   <h2 class="gradient-text opacity-90" >
				Welcome to <br>Endless Process
			</h2>
			{:else}
			 <h2 class="gradient-text opacity-0" >
				Welcome to <br>Endless Process
			</h2>
		{/if}
			<a href="/blog" data-sveltekit-noscroll>
				<SplashSVG />
			</a>
		<hr class="!border-t-8 !border-double" />
		<NowPlaying />
	</div>
</div>


