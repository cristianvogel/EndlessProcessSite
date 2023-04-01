<script lang="ts">
	
	import { CablesAudioContext, CablesAudioFileURL, ElementaryAudioEngine, CablesPatch } from '$lib/stores/stores';
	import { get } from 'svelte/store';

	export let patch: string;
	export let bg: boolean = false;
	export let spin: boolean = false;

	let pathPatch: string = `src/lib/cables/${patch}/patch.js`;	
	$: 
		loadedTrack =  $CablesAudioFileURL[0] 
	$: 
		spin ? spinText([scrambleString("Endless"),scrambleString( "Process")]) : null

	// function that scrambles a string
	function scrambleString(str: string) {
		let a = str.split(""),
			n = a.length;

		for (let i = n - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			let tmp = a[i];
			a[i] = a[j];
			a[j] = tmp;
		}
		return a.join("");
	}

	const initializeCables = () => {
		CablesPatch.set ( new CABLES.Patch({
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
		}))
	};


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
		spinText(["Endless", "Process"])
	}

	function spinText(  prompts:string[] = ["",""]  ) {
	if ( typeof $CablesPatch !== 'string' ) {
			$CablesPatch.config.spinAndPrompt("",prompts[0],prompts[1])
		}
	}

</script>

<svelte:head>
	<script src={pathPatch} on:load={initializeCables}></script>

 
</svelte:head>

<div class="mb-4 h-screen">
	<canvas on:click={spinText}
		id="cables_{patch}"
		width="100%"
		height="100%"
		style="width: 100%; height: 100%; z-index: {bg? -1: 0}; position: fixed;"
	/>
</div>

<style>

</style>