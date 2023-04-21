<script lang="ts">
	/**
	 * Blog posts layout page
	 */
	import { Icon } from '@steeze-ui/svelte-icon';
	import { CaretSortDown } from '@steeze-ui/carbon-icons';
	import { singlePost } from '$lib/stores/stores';
	import { Utils } from '$lib/classes/Utils';
	import { onMount } from 'svelte';

	const defaultFeaturedImage = '/Default_Avatar.svg';
	export let data: any;
	const featuredImageStyle =
		'object-contain opacity-70 hover:opacity-100 rounded-lg p-1 w-full aspect-square';
	let isPhone: boolean = false;
	let isTablet: boolean = false;

	$: cardEnter = false;

	// the singPost store is set here and then used in the single post view
	function handleCardEnter({
		e,
		cardIndex,
		title,
		content,
		featuredImageUrl,
		id,
		date
	}: {
		e: MouseEvent;
		cardIndex: string;
		title: string;
		content: string;
		featuredImageUrl: string;
		id: string;
		date: string;
	}): void {
		cardEnter = true;
		const card = document.getElementById(cardIndex);
		if (card) {
			singlePost.set({
				title,
				content: { rawHTML: content, sanitisedHTML: content },
				featuredImageUrl,
				id,
				date,
				cardIndex
			});
		}
	}

	function handleCardLeave({ e, cardIndex }: { e: MouseEvent; cardIndex: string }): void {
		cardEnter = false;
	}

	function responsive() {
		isPhone = window.innerWidth < 640;
		isTablet = window.innerWidth < 1024;
	}

	onMount(() => {
		responsive();
	});
</script>

<svelte:window on:resize={responsive} />

<main>
	<div class="p-2 space-y-8 ">
		<Icon src={CaretSortDown} class="h-8 animate-pulse" />
		<ul
			class= "md:container md:mx-auto md:px-0
				sm:columns-1 md:columns-3
			gap-3 space-y-10 text-xl max-w-prose"
		>
				{#each data.posts as { id, title, featuredImage, content, date }, index}
					{@const cardIndex = Utils.repeatChar('═', index) + '・' + Utils.formatDate(date)}
					{@const routeSlug = Utils.camelCaseNoWhiteSpace(title ?? id)}
					{@const featuredImageUrl = featuredImage
						? featuredImage.node.sourceUrl
						: defaultFeaturedImage}
					{@const beforeStyle = `background-image: url(${featuredImageUrl}); 
          background-repeat: no-repeat; 
          background-position-y: 23%; 
          background-size: cover;
          opacity: 0.3`}
					<div
						class="card break-inside-avoid-column px-0 w-full variant-soft-surface"
						id={cardIndex}
						on:mouseenter={(e) =>
							handleCardEnter({ e, cardIndex, title, content, featuredImageUrl, id, date })}
						on:mouseleave={(e) => handleCardLeave({ e, cardIndex })}
					>
						<header>
							<span class="text-[0.5rem] pl-2 text-secondary-300">{cardIndex}</span>
						</header>
						<a href="/latest/{routeSlug}">
							<section class="p-4 hover:bg-zinc-800 relative">
								<!--  -->
								<h1 class="text-secondary-400">
									{title ?? 'New Post'}
								</h1>

								<!-- <div
									class="absolute inset-0 z-0 
                          before:content 
                          before:absolute 
                          before:inset-0"
									style={beforeStyle}
								/> -->
							</section>
						</a>
						<section class="card-footer p-2 w-full text-tertiary-600">
							<!-- todo: sanitise HTML for production -->
							{@html Utils.trimAndAddReadMoreLink(content ?? 'No content')}
						</section>
					</div>
				{/each}
		</ul>
	</div>
</main>
