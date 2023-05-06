<script lang="ts">
	import { PlaylistMusic } from '$lib/stores/stores';
	import { Audio } from '$lib/classes/Audio';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import { Scrubbing } from '$lib/stores/stores';
	import { onMount, createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	$: progress = Math.fround($PlaylistMusic.currentTrack?.progress as number) ;
	$: durationSecs = $PlaylistMusic.currentTrack?.duration || 0; // in seconds
	$: samplerParams = ( command: 'start' | 'stop' ) => { return {
			trigger: command === 'start' ? 1 : 0,
			startOffset,
			durationMs: durationSecs * 1000
		}}
	$: if (progress >= 0.99 && !$Scrubbing) {
		dispatch('cueNext', $PlaylistMusic.currentTrack?.title);
	}
		
	let isPhone = false;
	let isTablet = false;
	let startOffset = 0;

	function handleScrub(e: any) {
		if (!$Scrubbing) return;
		const { clientX, target } = e;
		const { left, width } = target.getBoundingClientRect();
		const x = clientX - left;
		const percent = x / width;
		startOffset = percent
		Audio.playWithScrub( {...samplerParams('stop'), startOffset} );
	}

	function replay() {
		$Scrubbing = false;
		Audio.playWithScrub( {...samplerParams('start'), startOffset})
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

	{#if !$Scrubbing }	
	<div in:fade >
		<ProgressBar
			label="Progress Bar"
			value={ Math.fround(progress * durationSecs) }
			height={  'h-[1em]'}
			meter="bg-gradient-to-r from-yellow-600 to-red-600"
			rounded="rounded-sm"
			min={0}
			max={durationSecs}
		/>
	</div>
	{:else}
	<div in:fade>
		<ProgressBar
			label="Progress Bar"
			value={ Math.fround(progress * durationSecs) }
			height={ 'h-[2em]'}
			meter="bg-gradient-to-r from-yellow-600 to-red-600"
			rounded="rounded-sm"
			min={0}
			max={durationSecs}
		/>
	</div>
	{/if}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		id="invisible-div"
		on:mousedown={(e) => {
			$Scrubbing = true;
			handleScrub(e);
		}}
		on:mousemove={handleScrub}
		on:mouseup={ ()=> {if ( $Scrubbing ) replay()} }
		on:mouseleave={ ()=>{ if ($Scrubbing)  replay()} }
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
		height: 2em;
		opacity: 0;
    	cursor: grab;
	}
</style>
