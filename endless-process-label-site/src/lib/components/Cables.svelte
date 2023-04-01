<script lang="ts">
	
	import { 
			CablesAudioContext, 
			CablesAudioFileURL, 
			ElementaryAudioEngine, 
			CablesPatch,
			CablesText } from '$lib/stores/stores';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { Utils } from '$lib/classes/Utils';

	export let patch: string;
	export let bg: boolean = false;
	export let spin: boolean = false;

	let pathPatch: string = `src/lib/cables/${patch}/patch.js`;	
	$: loadedTrack =  $CablesAudioFileURL[0] 
	$: if (spin) { 
		$CablesText[0] = Utils.rotateString($CablesText[0])
		$CablesText[1] = Utils.rotateString($CablesText[1])
		spinText($CablesText) 
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
			console.log('Elem AudioEngine initialized with CablesAudioContext');
		get(CablesAudioContext).resume();
	
	}

	function patchFinishedLoading() {
		spinText(["Endless", "Process"])
	}

	function spinText(  prompts:string[] = ["",""]  ) {
	if ( typeof $CablesPatch !== 'string' ) {
			$CablesPatch.config.spinAndPrompt("",prompts[0],prompts[1])
		}
	}
onMount(() => {
	initializeCables()
})
	
	</script>

<svelte:head>
	<script src={pathPatch} on:load={initializeCables}></script>

 
</svelte:head>

<div class="mb-4 ">
	<canvas 
		id="cables_{patch}"
		width="100%"
		height="100%"
		style="width: 100%; height: 100%; z-index: {bg? -137: 0}; position: fixed;"
	/>
</div>

<style>

</style>