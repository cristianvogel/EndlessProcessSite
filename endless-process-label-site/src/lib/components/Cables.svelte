<script lang="ts">
	import { CablesAudioContext, ElementaryAudioEngine } from '$lib/stores/stores';
	import { onDestroy, onMount } from 'svelte';
	import { get } from 'svelte/store';

	export let patch: string;
	type Cables = { [key: string]: any };

	let pathPatch: string = `${patch}/patch.js`;
	let cablesCanvas: HTMLCanvasElement;

	const initializeCables = () => {
		console.log('initializeCables: ', CABLES);
		CABLES.patch = new CABLES.Patch({
			patch: CABLES.exportedPatch,
			prefixAssetPath: `/${patch}/`,
			assetPath: '',
			jsPath: '',
			glCanvasId: `cables_${patch}`,
			glCanvasResizeToWindow: true,
			onError: showError,
			onPatchLoaded: patchInitialized,
			onFinishedLoading: patchFinishedLoading,
			canvas: { alpha: true, premultipliedAlpha: true },
			masterVolume: 0.707
		});
	};
	onMount(() => {});

	onDestroy(() => {
		//mute cables patch audio context
		$ElementaryAudioEngine.mute();
	});

	function showError(errId: number, errMsg: string) {
		alert('An error occured: ' + errId + ', ' + errMsg);
	}

	function patchInitialized() {
		// You can now access the patch object (CABLES.patch), register variable watchers and so on
		CablesAudioContext.set(CABLES.WEBAUDIO.getAudioContext());
		console.log('CablesAudioContext: ', $CablesAudioContext);
		$ElementaryAudioEngine.init($CablesAudioContext);
		get(CablesAudioContext).resume();
		console.log('Elem AudioEngine initialized with CablesAudioContext');
	}

	function patchFinishedLoading() {}
</script>

<svelte:head>
	<script src={pathPatch} on:load={initializeCables}></script>
</svelte:head>

<div class="mb-4 h-screen">
	<canvas
		class="z-0 absolute"
		id="cables_{patch}"
		width="100%"
		height="100%"
		style="width: 100%; height: 100%;"
		bind:this={cablesCanvas}
	/>
</div>
