<script lang="ts">
	// Single post view
	import AudioPlayer from '$lib/components/EmbeddedAudioPlayer.svelte';
	import { singlePost } from '$lib/stores/stores';

	const { content, title, cardIndex } = $singlePost;

	export let data: any;
</script>

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
