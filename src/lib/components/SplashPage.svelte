<script>
	// Splash opening
	import SplashSVG from '$lib/components/images/SplashSVG.svelte';
	import NowPlaying from './NowPlaying.svelte';
	import {Audio} from '$lib/classes/Audio';
	import { singlePost } from '$lib/stores/stores';
	import TextToSpeech from '$lib/components/Speech/TextToSpeech.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { CaretSortDown } from '@steeze-ui/carbon-icons';
	import { page } from '$app/stores';

	const { audioStatus } = Audio.stores

	$: splash =  ( $audioStatus !== 'playing') ? !$singlePost.isOpen : false;
	$: postView = $singlePost.isOpen;
	$: blogPostsView = $page.route.id?.includes( 'blog' );

</script>
	
<div class="container mx-auto w-[30%] flex-none" on:mousedown>
	<div class="space-y-2 -my-5 text-center">
		{#if !postView}							
			<a href="/blog" data-sveltekit-noscroll>
				<SplashSVG />
			</a>		   
			<hr class="!border-t-4 !border-double" />
		{/if}
	
		{#if splash}
		   <h2 class="gradient-text opacity-90" >
				Welcome.
			</h2>
			{:else if !postView && !blogPostsView}
	  		<Icon 
			src={CaretSortDown} 
			class="h-8 animate-pulse"
		/>
		{/if}
		
	</div>
</div>


