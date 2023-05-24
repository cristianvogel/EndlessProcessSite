<script>
	// Splash opening
	import SplashSVG from '$lib/components/images/SplashSVG.svelte';
	import { Decoded, singlePost } from '$lib/stores/stores';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { CaretSortDown } from '@steeze-ui/carbon-icons';
	import { page } from '$app/stores';
	import { Utils } from '$lib/classes/Utils';
	import { fade, fly } from 'svelte/transition';

	let ticker = 0;
	let lofiAnim = ''
	let hide = false;
	let hideTimer;
	const tickerTimer = setInterval(() => { ticker++;}, 100);
	$: if (ready) {
		clearInterval(tickerTimer);
		hideTimer = setTimeout(() => {
			hide = true;
		}, 3 * 1.0e3);
	};
	$: postView = $singlePost.isOpen;
	$: blogPostsView = $page.route.id?.includes( 'blog' );
	$: ready = $Decoded.done;
	$: lofiAnim = ((ticker % 2) === 0 ? Utils.scrambleString('▂▃▄▅▆▇▆▅▄▃▂') : Utils.scrambleString(lofiAnim))

</script>
	
<div class="container mx-auto w-[30%] flex-none" on:mousedown>
	<div class="space-y-2 -my-5 text-center">
		{#if !postView}							
			<a href= {blogPostsView ? "/" : "/blog"} data-sveltekit-noscroll>
				<SplashSVG />
			</a>		   
			<hr class="!border-t-4 !border-double" />
		{/if}
		{#if !postView && !blogPostsView }
			{#if !ready }			
				<h2 class="gradient-text" >
				<div out:fade>{lofiAnim}</div>	
				</h2>
			{/if}
			{#if ready}
				<h2 class="gradient-text" >	
				<div in:fly={{ y:-200, duration: 500}}>Welcome.</div>
				</h2>
			{/if}		
			<a href='/blog' data-sveltekit-noscroll>
	  		<Icon src={CaretSortDown} 
			class="h-8 animate-pulse"/>
		</a>
		{/if}
		</div>
</div>



