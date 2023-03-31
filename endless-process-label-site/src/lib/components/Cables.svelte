<script lang="ts">
	
	import { CablesAudioContext, CablesAudioFileURL, ElementaryAudioEngine, CablesPatch } from '$lib/stores/stores';
	import { get } from 'svelte/store';

	export let patch: string;
	export let change: boolean = false;

	let pathPatch: string = `src/lib/cables/${patch}/patch.js`;
	let cablesCanvas: HTMLCanvasElement;	
	let loadedTrack: string =  get(CablesAudioFileURL)[0];

	const initializeCables = () => {
		CABLES.patch = new CABLES.Patch({
			patch: CABLES.exportedPatch,
			prefixAssetPath: `src/lib/cables/${patch}/`,
			assetPath: '',
			jsPath: '',
			glCanvasId: `cables_${patch}`,
			glCanvasResizeToWindow: true,
			onError: showError,
			onPatchLoaded: patchInitialized,
			onFinishedLoading: patchFinishedLoading,
			canvas: { alpha: true, premultipliedAlpha: true },
			masterVolume: 0.707,
			variables:{
				"CablesAudioFileURL": loadedTrack,
				"CablesMute": false,
				"CablesTextUpdate": "Welcome"
			}
		})
		CablesPatch.set(CABLES.patch);
	};

	// onDestroy(() => {
	// 	//mute cables patch when component is destroyed
	// 	$ElementaryAudioEngine.muteAndSuspend();
	// });

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

	function patchFinishedLoading() {
		spinText(null, "Welcome")
	}

	function spinText( e: Event | null,  prompt = ''  ) {
	if ( $CablesPatch.hasOwnProperty('patch') ) {
		console.log('spin and prompt');
		$CablesPatch.config.spinAndPrompt("",prompt,"")
	}
	}


</script>

<svelte:head>
	<script src={pathPatch} on:load={initializeCables}></script>
</svelte:head>

<div class="mb-4 h-screen">
	<canvas on:click={spinText}
		class="z-0 absolute"
		id="cables_{patch}"
		width="100%"
		height="100%"
		style="width: 100%; height: 100%;"
		bind:this={cablesCanvas}
	/>
</div>
