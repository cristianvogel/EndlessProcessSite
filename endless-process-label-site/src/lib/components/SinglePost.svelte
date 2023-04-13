<script lang="ts">
	// Single post view
	import AudioPlayer from '$lib/components/EmbeddedAudioPlayer.svelte';
	import { singlePost } from '$lib/stores/stores';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Close } from '@steeze-ui/carbon-icons';
	import { onMount } from 'svelte';

	const { content, title, cardIndex } = $singlePost;

onMount(() => {
		singlePost.update((post) => {
			post.isOpen = true;
			return post;
		});
	});
	
</script>
<div class="flex justify-end -mb-2 mr-1">
	<span class="chip variant-soft hover:variant-ghost-secondary mr-3 p-0 z-50" on:click on:keydown>
		<span><Icon src={Close} class="fill-tertiary-400 h-10 w-10 p-0 m-0" /></span>
	</span>
</div>
<div class="m-0 p-6 bg-gradient-to-br from-surface-500 to-surface-800 opacity-95 m-3">

	<div class="bg-transparent p-3 text-tertiary-400 opacity-80">
		
		<h6 class="subheading">{cardIndex}</h6>
		<h1 class="">{title}</h1>
	</div>
	<section class="grid grid-cols-3 p-1 divide-x-2 divide-tertiary-800 ">
		{#if content}
			<div class="col-span-1 p-3 rounded-lg text-tertiary-400 text-left text-sm opacity-80">
				<ul>
					<li><a class="!no-underline" href="/">Find out more</a></li>
			
				<span class="flex justify-end"><AudioPlayer /></span>
        	</ul>
			</div>
			<article
				class="prose dark:prose-invert 
              prose-img:rounded-xl
              break-inside-avoid-column
              prose-xl
              leading-normal
              col-span-2 ">
				{@html content.sanitisedHTML}
			</article>
		{/if}
	</section>
</div>
