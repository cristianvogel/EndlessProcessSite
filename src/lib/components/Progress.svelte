<script lang="ts">
	import { PlaylistMusic } from '$lib/stores/stores';
	import { Audio } from '$lib/classes/Audio';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import { Scrubbing } from '$lib/stores/stores';
	import { onMount, tick, createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();


	$: progress = $PlaylistMusic.currentTrack?.progress || 0;
	$: duration = $PlaylistMusic.currentTrack?.duration || 0; // in seconds
	$: tick().then (() =>{ 
		Audio.progress = progress as number;
	});

	$: if (progress >= 0.99) {
		$Scrubbing = false;
		dispatch('cueNext', $PlaylistMusic.currentTrack?.title);
	}
		
	
	let start: number = 0;
	let isPhone = false;
	let isTablet = false;

	function handleScrub(e: any) {
		if (!$Scrubbing) return;
		const { clientX, target } = e;
		const { left, width } = target.getBoundingClientRect();
		const x = clientX - left;
		const percent = x / width;
		start = Math.round(percent * duration * 1000); // to ms
		Audio.playWithScrub({
			trigger: 0,
			startOffset: start
		});
	}

	function replay() {
		$Scrubbing = false;
		Audio.playWithScrub({ trigger: 1, startOffset: start })
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

<div id="parent">
	<ProgressBar
		label="Progress Bar"
		value={progress * duration}
		height={isPhone ? 'h-[1.5em]' : 'h-[1em]'}
		meter="bg-gradient-to-r from-yellow-600 to-red-600"
		rounded="rounded-sm"
		min={0}
		max={duration}
	/>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		id="invisible-div"
		on:mousedown={(e) => {
			$Scrubbing = true;
			handleScrub(e);
		}}
		on:mousemove={handleScrub}
		on:mouseup={replay}
		on:mouseleave={ ()=> $Scrubbing = false }
	/>
</div>

<style>
	#parent {
		position: relative;
	}

	#invisible-div {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 1.5em;
		opacity: 0;
    	cursor: grab;
	}
</style>
