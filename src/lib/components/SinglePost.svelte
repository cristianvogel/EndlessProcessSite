<script lang="ts">
	// Single post view
	import AudioPlayer from '$lib/components/EmbeddedAudioPlayer.svelte';
	import { singlePost } from '$lib/stores/stores';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Close, PageFirst } from '@steeze-ui/carbon-icons';
	import { onDestroy, onMount } from 'svelte';
	import { Wait } from '$lib/classes/Utils';

	const { content, title, cardIndex, featuredImageUrl } = $singlePost;
	Wait.forValid(content.sanitisedHTML);

	//  a function that extracts all <img> elements from the content, which is a string of HTML and removes them from the content
	function extractImages(): { prunedHTML: Document; imageURLs: Array<string> } {
		const images: Array<string> = [];
		const parser = new DOMParser();
		let doc: Document = parser.parseFromString(content.sanitisedHTML, 'text/html');
		const imgElements = doc.querySelectorAll('img');
		doc.querySelectorAll('img').forEach((img) => {
			img.remove();
		});
		imgElements.forEach((img) => {
			images.push(img.src);
		});
		return { prunedHTML: doc, imageURLs: images };
	}

	const { prunedHTML, imageURLs } = extractImages();

	onMount(() => {
		singlePost.update((post) => {
			post.isOpen = true;
			return post;
		});
	});

	onDestroy(() => {
		singlePost.update((post) => {
			post.isOpen = false;
			return post;
		});
	});


</script>

<div class="flex justify-end md:-mb-20 md:mr-14">
	<span class="chip variant-soft hover:variant-filled-secondary ml-3 p-0 z-50">
		<a href='/blog'><Icon src={PageFirst} class="fill-tertiary-400 h-8 w-10 p-0 m-0" /></a>
	</span>
	<span class="chip variant-soft hover:variant-filled-secondary mr-6 p-0 z-50" on:click on:keydown>
		<span><Icon src={Close} class="fill-tertiary-400 h-10 w-10 p-0 m-0" /></span>
	</span>
</div>
<!-- <div class="m-0 p-6 bg-gradient-to-br from-transparent to-surface-800 m-3"> -->
	<div class="card variant-soft-warning md:m-20 sm:m-1">
	<div class="bg-transparent p-3 text-tertiary-400 opacity-80">
		<h6 class="subheading">{cardIndex}</h6>
		<h1 class="">{title}</h1>
	</div>
	<section class="grid grid-cols-3 p-1 divide-x-2 divide-tertiary-800 ">
		{#if prunedHTML}
			<div class="
			col-span-1 
			p-3 rounded-lg 
			text-tertiary-400 
			text-left 
			text-sm 
			opacity-80
			">
				<ul>
					<!-- <span class="flex justify-end"><AudioPlayer /></span> -->
					{#if featuredImageUrl}
						<img src={featuredImageUrl} alt="featured artwork" class="w-35 h-22 p-3" />
					{/if}
		
					{#each imageURLs as url}
						<img src={url} alt="featured artwork" class="w-35 h-22 p-3" />
					{/each}
				</ul>
			</div>
			<article
				class="prose dark:prose-invert 
              prose-img:rounded-xl
              break-inside-avoid-column
             md: !prose-2xl
			 sm: !prose-sm
			 sm: !leading-tight
             col-span-2 "
			>
				{@html prunedHTML.body.innerHTML}
			</article>
		{/if}
	</section>
</div>
