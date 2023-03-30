<script lang="ts">
	import {
		ElementaryAudioEngine as AudioEngine,
		audioStatus
	} from '$lib/stores/stores';
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

	let isPlaying: boolean = false;
	$: isPlaying = ($audioStatus === 'running')
	$: buttonPrompt = !isPlaying ? 'Play' : 'Stop';

	function handleClick(ev: MouseEvent) {
		if ($AudioEngine.state !== 'running') $AudioEngine.resume();

		if (isPlaying) {
			$AudioEngine.mute();
			return;
		} else {
			$AudioEngine.unmute();
		}
		// pretty cool placeholder sound for now
		$AudioEngine.demoSynth();
	}
</script>

{#if $AudioEngine}
	<button class="rounded-full bg-secondary-500 text-xs p-2" on:mousedown={handleClick}>
		{buttonPrompt} Audio
	</button>
{/if}
