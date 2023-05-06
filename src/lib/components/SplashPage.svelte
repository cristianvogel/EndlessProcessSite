<script>
	// Splash opening
	import SplashSVG from '$lib/components/images/SplashSVG.svelte';
	import { singlePost } from '$lib/stores/stores';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { CaretSortDown } from '@steeze-ui/carbon-icons';
	import { page } from '$app/stores';

	$: postView = $singlePost.isOpen;
	$: blogPostsView = $page.route.id?.includes( 'blog' );

</script>
	
<div class="container mx-auto w-[30%] flex-none" on:mousedown>
	<div class="space-y-2 -my-5 text-center">
		{#if !postView}							
			<a href= {blogPostsView ? "/" : "/blog"} data-sveltekit-noscroll>
				<SplashSVG />
			</a>		   
			<hr class="!border-t-4 !border-double" />
		{/if}
		{#if !postView && !blogPostsView  }
		   <h2 class="gradient-text opacity-90" >
				Welcome.
			</h2>
			<a href='/blog' data-sveltekit-noscroll>
	  		<Icon src={CaretSortDown} 
			class="h-8 animate-pulse"/>
		</a>
		{/if}
		</div>
</div>



