<script lang="ts">
	import { _AudioEngine as AudioEngine, audioStatus } from '$lib/stores/stores';
	import { el } from '@elemaudio/core';
	import { onMount } from 'svelte';

	onMount(() => {
		$AudioEngine.init(new AudioContext());
	});

	$: isPlaying = $audioStatus === 'playing';
	$: buttonPrompt = !isPlaying ? 'Play' : 'Stop';

	function handleClick(ev: MouseEvent) {
		if ($AudioEngine.ctx?.state !== 'running') $AudioEngine.resume();

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
