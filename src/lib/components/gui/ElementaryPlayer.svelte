<script lang="ts">
	import { Decoded, PlaylistMusic, RendererStatus } from '$lib/stores/stores';
	import { PauseOutline, PlayOutline, QueryQueue } from '@steeze-ui/carbon-icons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { onDestroy } from 'svelte';
	import PlaylistView from '$lib/components/gui/PlaylistView.svelte';

	let trackTitles: Array<string>;

	$: trackTitles = $PlaylistMusic.titles?.music as [];
	$: isPlaying = $RendererStatus.music === 'playing';
	
	onDestroy(() => {
	//	AudioMain.actx.close();
	});

</script>

{#if $Decoded.done}
	<div class="z-50 col-span-1 row-span-1 order-1 ">
		<button class="shrink-0"
			id="transport"
			on:click>
			<Icon
				src={isPlaying ? PauseOutline : PlayOutline}
				class={isPlaying ? 'h-8 fill-secondary-200' : 'h-8 animate-pulse fill-secondary-300'}
				data-sveltekit-noscroll
			/>
		</button>
	</div>
	<div class="z-50 col-span-1 row-span-1 order-2">
		<button
			class="shrink-0"
			id="playlist"
			on:click
		>
			<Icon src={QueryQueue} class="h-8 rotate-180 fill-secondary-300 " data-sveltekit-noscroll />
		</button>
	</div>
		{#if $PlaylistMusic.show}
			<PlaylistView tracklisting={trackTitles} />
		{/if}
	
{/if}
