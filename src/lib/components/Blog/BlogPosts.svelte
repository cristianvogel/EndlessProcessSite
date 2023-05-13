<script lang="ts">
	/**
	 * Blog posts layout page
	 */
	import { Icon } from '@steeze-ui/svelte-icon';
	import {  Data2, JoinInner, Settings } from '@steeze-ui/carbon-icons'
	import { CaretSortDown } from '@steeze-ui/carbon-icons';
	import { singlePost } from '$lib/stores/stores';
	import { Utils } from '$lib/classes/Utils';
	import { onMount } from 'svelte';
	

	const defaultFeaturedImage = '/Default_Avatar.svg';
	const placeHolderCard = {
		id: '',
		title: '∞ ',
		content: { sanitisedHTML: `<div class='info'>Loading...</div>` },
		date: ''
	}

	const placeHolders = new Array(3).fill(placeHolderCard)

	export let blogPosts = placeHolders;
	export let loaded:boolean;

	let isPhone: boolean = false;
	let isTablet: boolean = false;
	const gradients = '/svg/spectrum-gradient.svg'

	$: cardEnter = false;
	
		type BlogPostData =  {
		e: MouseEvent;
		cardIndex: string;
		title: string;
		content: {rawHTML: string, sanitisedHTML: string};
		featuredImageUrl: string;
		id: string;
		date: string;
	}
	// the single post store is set here and then used in the single post view
	function handleCardEnter(blogPostData:BlogPostData): void {
		const { e, title, content, featuredImageUrl, id, date, cardIndex } = blogPostData
		cardEnter = true;
		const card = document.getElementById(cardIndex);
		if (card) {
			singlePost.set({
				title,
				content,
				featuredImageUrl,
				id,
				date,
				cardIndex
			});
		}
	}

	function handleCardLeave(): void {
		cardEnter = false;
	}

	function responsive() {
		isPhone = window.innerWidth < 640;
		isTablet = window.innerWidth < 1024;
	}

	onMount(() => {
		responsive();
		
	});


	$:placehold = !loaded
</script>

<svelte:window on:resize={responsive} />

<main>
	<div class="p-2 space-y-8 ">
		<Icon 
			src={placehold ? Settings : CaretSortDown} 
			class={placehold ?  "h-8 animate-spin" : "h-8 animate-pulse"} 
		/>
		<ul
			class= "md:container md:mx-auto md:px-0
				sm:columns-1 md:columns-3
			gap-3 space-y-10 text-xl max-w-prose"
		>
				{#each (placehold ? placeHolders : blogPosts) as { id, title, featuredImage, content, date }, index}
					{@const cardIndex = Utils.repeatChar('═', index) + '・' + Utils.formatDate(date)}
					{@const routeSlug = Utils.camelCaseNoWhiteSpace(title ?? id)}
					{@const featuredImageUrl = featuredImage
						? featuredImage.node.sourceUrl
						: defaultFeaturedImage}
					{@const beforeStyle = 
						`background-image: url(${gradients}); 
						 background-repeat: no-repeat; 
						 background-size: cover;
						 opacity: 0.3`
						}
					<div
						class="card break-inside-avoid-column {placehold ? 'variant-soft-surface' : 'variant-ghost-surface'} px-0 w-full"
						id={cardIndex}
						on:mouseenter={(e) =>
							handleCardEnter({ e, cardIndex, title, content: {rawHTML: content, sanitisedHTML: content}, featuredImageUrl, id, date })}
						on:mouseleave={(e) => handleCardLeave()}
					>
						<header>
							<span class="text-[0.5rem] pl-2 text-secondary-300">{cardIndex}</span>
						</header>
						<a href="/latest/{routeSlug}" data-sveltekit-preload-data="hover">
							<section class="p-4 hover:bg-zinc-800 relative">
								<!-- title  -->
								<h1 class="text-secondary-300">
									{#if !placehold}
									{title ?? 'New Post'}
									{:else}
									<Icon 
									src={JoinInner}
									class= "h-8 animate-ping"
								/>
									{/if}
								</h1>

								<div
									class="absolute inset-0 z-0 
											before:content 
											before:absolute 
											before:inset-0"
									style={beforeStyle}
								/>
							</section>
						</a>
						<section class="card-footer p-2 w-full text-tertiary-600">
							<!-- todo: sanitise HTML for production -->
							{#if !placehold}
							   	{@html Utils.trimAndAddReadMoreLink(content ?? '')}
							{:else}
								<Icon 
									src={Data2}
									class= "h-8 animate-ping"
								/>
							{/if}
						</section>
					</div>
				{/each}
		</ul>
	</div>
</main>