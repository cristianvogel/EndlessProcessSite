<script lang="ts">
	// Single post view
	import { singlePost } from '$lib/stores/stores';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Close, PageFirst } from '@steeze-ui/carbon-icons';
	import { onDestroy, onMount } from 'svelte';
	import ImageModal from '$lib/components/UI/ImageModal.svelte';
	import { preloadData } from '$app/navigation';
	
	let modalOpen = false;
	let isPhone: boolean = false;

	const { content, title, cardIndex, featuredImageUrl } = $singlePost;
	$:selectedImage = '';

	function parseAndRewriteBlogPostHTML(): { prunedHTML: Document; imageSources: Array<string> } {
		const imageSources: Array<string> = [];
		const parser = new DOMParser();
		let doc: Document = parser.parseFromString(content.sanitisedHTML, 'text/html');
		const imgElements = doc.querySelectorAll('img');
		doc.querySelectorAll('video').forEach((vid) => {
			vid.style.maxWidth = isPhone ? '90%' : '60%';
			vid.style.borderRadius = '25px';
			vid.style.margin = 'auto';
		})
		doc.querySelectorAll('img').forEach((img) => {
			img.remove();
		});
		imgElements.forEach((img) => {
			imageSources.push(img.src);
		});
		return { prunedHTML: doc, imageSources };
	}

	const { prunedHTML, imageSources: imageURLs } = parseAndRewriteBlogPostHTML();

	function activeImage(e:any) {
		e.target.style.cursor = 'zoom-in';
		selectedImage = e.target.src;
	};	

	function responsive() {
			isPhone = window.innerWidth < 640;
			
	}

	
	onMount(() => {
		preloadData('/blog');
		singlePost.update((post) => {
			post.isOpen = true;
			return post;
		});
		responsive();
	});

	onDestroy(() => {
		singlePost.update((post) => {
			post.isOpen = false;
			return post;
		});
	});


</script>



<div class="flex justify-start md:-mb-20 md:mr-14">
	<span class="chip variant-soft hover:variant-filled-secondary ml-3 p-0 z-50">
		<a href='/blog' ><Icon src={PageFirst} class="fill-tertiary-400 h-8 w-10 p-0 m-0" /></a>
	</span>
	<span class="chip variant-soft hover:variant-filled-secondary mr-6 p-0 z-50" on:click on:keydown>
		<span><Icon src={Close} class="fill-tertiary-400 h-10 w-10 p-0 m-0" /></span>
	</span>
</div>
	<div class="card variant-soft-surface md:m-20 sm:m-1">
	<div class="bg-transparent p-3 text-tertiary-400 opacity-80">
		<h6 class="subheading">{cardIndex}</h6>
		<h1 class="">{title}</h1>
	</div>

	{#if modalOpen }
	   <ImageModal imageUrl={selectedImage} altText={title} onClose={()=>modalOpen = false} />
	{/if}
	
	<section class="grid md:grid-cols-3 sm:grid-cols-2 p-1 md:divide-x-2 md:divide-tertiary-800 ">
		{#if prunedHTML}
	
			<article
				class="prose dark:prose-invert 
              prose-img:rounded-xl
              break-inside-avoid-column
             md:!prose-2xl
			 sm:!prose-sm
             md:col-span-2
			 sm:col-span-1"
			>
				{@html prunedHTML.body.innerHTML}
			</article>
					<div class="
			col-span-1 
			p-3 rounded-lg 
			text-tertiary-400 
			text-left 
			text-sm 
			opacity-80
			">
				<ul>
					{#if featuredImageUrl}
						<img src={featuredImageUrl} alt="featured artwork" class="w-35 h-22 p-3 rounded-lg" 
						on:click={()=>modalOpen = true}
						on:mouseenter={activeImage}
						on:focus={activeImage}
						on:keypress={activeImage}
						 />
					{/if}
		
					{#each imageURLs as url}
						<img src={url} alt="featured images" class="w-35 h-22 p-3 rounded-lg"
						on:click={()=>modalOpen = true}
						on:mouseenter={activeImage}
						on:focus={activeImage}
						on:keypress={activeImage} 
						/>
					{/each}
				</ul>
			</div>
		{/if}
	</section>
</div>

<style>
	
	.rewritten-video {
		width: 60%;
		margin: auto;
	}
</style>