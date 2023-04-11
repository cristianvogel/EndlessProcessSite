<script>
	// Splash opening
	import SplashSVG from '$lib/components/SplashSVG.svelte';
	import NowPlaying from './NowPlaying.svelte';
	import {Audio} from '$lib/stores/AudioEngine';
	import { fade } from 'svelte/transition';
	const { audioStatus } = Audio.stores

	$: isPlaying = $audioStatus === 'playing';

</script>

<div class="container mx-auto my-2 w-[30%] flex-none" on:mousedown>
	<div class="space-y-10 text-center">
		
		   <h2 class={isPlaying ? "gradient-text opacity-40" : "gradient-text opacity-90"} transition:fade>
			Welcome to <br>Endless Process
		</h2>
	
			<a href="/blog" data-sveltekit-noscroll>
				<SplashSVG />
			</a>
	
		<hr class="!border-t-8 !border-double" />
		<NowPlaying />
	</div>
</div>


