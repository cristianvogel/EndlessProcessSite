<script lang="ts">
	import { Audio } from '$lib/stores/AudioEngine';
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	import { onMount, tick } from 'svelte';

	onMount(() => {
		/**
		 * Using the Cables audio context
		 * but would probably need to have a fallback
		 * in case the Cables patch doesn't exist
		 */
		// quick hack didn't work  though
		// if (!$AudioEngine.ctx) {
		// 	$AudioEngine.init(new AudioContext());
		// 	console.log('El AudioEngine initialized with new AudioContext()');
		// }
	});
	const { isPlaying, audioStatus } = Audio.stores

</script>

{#if $audioStatus !== 'closed'}
	<button class="rounded-full bg-secondary-500 text-xs p-2" on:mousedown >
		{$isPlaying ? 'stop' : 'play'} Audio
	</button>
{/if}
