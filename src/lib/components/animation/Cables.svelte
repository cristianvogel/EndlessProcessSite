<script lang="ts">
	
	import { 
			CablesPatch,
			CablesText,
			CablesIsLoaded,
			CablesAudioContext,
			Decoded,
			RendererStatus,
		} from '$lib/stores/stores';
	import { onMount } from 'svelte';
	import { Utils } from '$lib/classes/Utils'
	import { tweened } from 'svelte/motion';
	import { expoIn, expoInOut } from 'svelte/easing';

	export let patch: string;
	export let bg: boolean = false;
	export let spin: boolean = false;
	
	let pathPatch: string = `/cables/${patch}/patch.js`;	

	const fadeUp = tweened(0, {
		duration: 1000,
		easing: expoInOut
	});
	$: if (spin) { 
		CablesText.set( [ Utils.rotateString($CablesText[0]), Utils.rotateString($CablesText[1]) ] )
		cablesScrollerText($CablesText) 
	}

	const initializeCables =  () => {
		CablesPatch.set ( new CABLES.Patch({
			patch: CABLES.exportedPatch,
			prefixAssetPath: `/cables/${patch}/`,
			assetPath: '',
			jsPath: '',
			glCanvasId: `cables_${patch}`,
			glCanvasResizeToWindow: true,
			onError: showError,
			onPatchLoaded: patchInitialized,
			onFinishedLoading: patchFinishedLoading,
			canvas: { alpha: true, premultipliedAlpha: true },
			variables:{
				"CablesMute": false,
				"CablesTextUpdate": "Endless Process",
				"CablesAnalyzerNodeInput": {}
			}
		}))
	};

	function showError(errId: number, errMsg: string) {
		alert('Cables error occured: ' + errId + ', ' + errMsg);
	}

	function patchInitialized() { } 

	async function  patchFinishedLoading() {
		CablesIsLoaded.update( ($flag) => {$flag = true; return $flag} );
		CABLES.WEBAUDIO.getAudioContext().suspend()
		$CablesAudioContext = CABLES.WEBAUDIO.getAudioContext()
		cablesScrollerText();	
	}

	function cablesScrollerText(  prompts:string[] = ["End","Proc"]  ) {
	if ( $CablesIsLoaded ) {
			$CablesPatch.config.spinAndPrompt('',prompts[0],prompts[1]) // bug in Cables won't pass first arg
		}
	}

	function done(element: HTMLElement) {fadeUp.set(1)};
	
	onMount( () => { initializeCables() })
	</script>

<svelte:head>
	<!-- todo: move this data load server side? -->
	<script src={pathPatch}></script>
</svelte:head>
{#if ($RendererStatus.speech === 'ready') && $Decoded.done }
 <div data-comment use:done />
{/if}
<div class="mb-4 " style='opacity: {$fadeUp}'>
	<canvas 
		id="cables_{patch}"
		width="100%"
		height="100%"
		style="	width: 100%; height: 100%; 
				z-index: {bg? -137: 0}; 
				position: fixed;"
	  />
</div>