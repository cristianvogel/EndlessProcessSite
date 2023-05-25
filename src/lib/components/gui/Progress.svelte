<script lang="ts">
	import { AudioMain } from '$lib/classes/Audio';
	import { PlaylistMusic, RendererStatus } from '$lib/stores/stores';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	const dispatch = createEventDispatcher();
		
	let innerWidth:number;
	let isPhone,isTablet = false;
	let startOffset:number = 0;

	$: musicScrubbing = $RendererStatus.music === 'scrubbing';
	$: isPhone = innerWidth < 400;
	$: isTablet = innerWidth < 1024;
	$: normProgress = Math.fround($PlaylistMusic.currentTrack?.progress as number) ;
	$: durationSecs = $PlaylistMusic.currentTrack?.duration || 0; // in seconds
	$: samplerParams = ( command: 'start' | 'stop' ) => { return {
			trigger: command === 'start' ? 1 : 0,
			durationMs: durationSecs * 1000
		}}
	$: if (normProgress >= 0.998 && !musicScrubbing) {
		dispatch('cueNext', $PlaylistMusic.currentTrack?.title);
	}

	function handleScrub(e: any) {
		if (!musicScrubbing) return;
		$RendererStatus.music = 'scrubbing';
		const { clientX, target } = e;
		const { left, width } = target.getBoundingClientRect();
		const x = clientX - left;
		const percent = x / width;
		startOffset = percent
		AudioMain.playMusicFromVFS( {...samplerParams('stop'), startOffset} );
	}

	function releaseScrub() {
		if (!musicScrubbing) return;
		$RendererStatus.music = 'playing';
		AudioMain.playMusicFromVFS( {...samplerParams('start'), startOffset})
		}

</script>

<svelte:window bind:innerWidth/>

<div id="parent">
	{#if !musicScrubbing }	
	<div in:fade >
		<ProgressBar
			label="Progress Bar"
			value={ Math.fround(normProgress * durationSecs) }
			height={  'h-[1em]'}
			meter="bg-gradient-to-r from-yellow-600 to-red-600"
			rounded="rounded-sm"
			min={0}
			max={durationSecs}
		/>
	</div>
	{:else}
	<div class='-mt-2' in:fade>
		<ProgressBar
			label="Progress Bar"
			value={ Math.fround(normProgress * durationSecs) }
			height={ 'h-[2em]'}
			meter="bg-gradient-to-r from-yellow-600 to-red-600"
			rounded="rounded-sm"
			min={0}
			max={durationSecs}
		/>
	</div>
	{/if}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div id="invisible-div"
		on:mousedown|preventDefault|stopPropagation={(e) => {
			$RendererStatus.music = 'scrubbing';
			handleScrub(e);
		}}
		on:mousemove|preventDefault={handleScrub}
		on:mouseup={releaseScrub}
		on:mouseleave={releaseScrub}  
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
