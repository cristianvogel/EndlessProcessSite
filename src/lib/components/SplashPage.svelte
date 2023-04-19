<script>
	// Splash opening
	import SplashSVG from '$lib/components/SplashSVG.svelte';
	import NowPlaying from './NowPlaying.svelte';
	import {Audio} from '$lib/classes/Audio';
	import { loadingSomething, singlePost } from '$lib/stores/stores';
	import FolderScan from '$lib/components/FolderScan.svelte';
	import TextToSpeech from '$lib/components/Speech/TextToSpeech.svelte';
	const { audioStatus } = Audio.stores

	$: splash =  ( $audioStatus !== 'playing') ? !$singlePost.isOpen : false;
	$: postView = $singlePost.isOpen;

</script>
{#if $loadingSomething.state}
   <div class='absolute info top-30 left-3 -z-10'><FolderScan /></div>
{/if}

	
	<div class='absolute info top-30 right-1 -mt-2'><TextToSpeech/></div>

<div class="container mx-auto my- w-[30%] flex-none" on:mousedown>
	<div class="space-y-2 text-center">
		
		{#if !postView}							
			<a href="/blog" data-sveltekit-noscroll>
				<SplashSVG />
			</a>		   
			<hr class="!border-t-4 !border-double" />
		{/if}
	
		{#if splash}
		   <h2 class="gradient-text opacity-90" >
				Welcome!
			</h2>
			{:else}
	    <NowPlaying />
		{/if}
		
	</div>
</div>


