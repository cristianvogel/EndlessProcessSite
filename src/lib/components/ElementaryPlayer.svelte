<script lang="ts">
	import { Audio } from '$lib/classes/Audio';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { PauseOutline, PlayOutline, QueryQueue } from '@steeze-ui/carbon-icons';
	import { Decoded, PlaylistMusic } from '$lib/stores/stores';
	import PlaylistView from './PlaylistView.svelte';

	const { audioStatus } = Audio.stores;

	let clickListenerRegistered = false;
	let trackTitles: Array<string>;

	$: trackTitles = $PlaylistMusic.titles;
	$: isPlaying = $audioStatus === 'playing';

	function forceAudioContextResume() {
		if (clickListenerRegistered) {
			return;
		} else {
			Audio.resumeContext();
			clickListenerRegistered = true;
		}
	}
</script>

<svelte:window on:mousedown={forceAudioContextResume} />

{#if ($audioStatus !== 'loading' || 'closed ') && $Decoded.done}
	<div class="z-10 flex basis-1/2 flex-row gap-4 ">
		<button
			class="basis-1/8 shrink-0 items-center rounded-full bg-surface-700 p-1"
			id="transport"
			on:click
		>
			<Icon
				src={isPlaying ? PauseOutline : PlayOutline}
				class={isPlaying ? 'h-8 fill-secondary-200' : 'h-8 animate-pulse fill-secondary-300'}
				data-sveltekit-noscroll
			/>
		</button>
		<button
			class="basis-1/8 shrink-0 items-center rounded-full bg-surface-700 p-2"
			id="playlist"
			on:click
		>
			<Icon src={QueryQueue} class=" h-8 rotate-180 fill-secondary-300" data-sveltekit-noscroll />
		</button>
		{#if $PlaylistMusic.show}
			<!-- Playlist -->
			<div class="indent-x-10 text-s absolute top-10 bg-surface-700 p-3 text-tertiary-800">
				<PlaylistView tracklisting={trackTitles} />
			</div>
		{/if}
	</div>
{/if}
