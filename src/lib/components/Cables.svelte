<script lang="ts">
	
	import { 
			CablesPatch,
			CablesText,
			CablesIsLoaded,
			CablesAudioContext,
		} from '$lib/stores/stores';
	import Initialisation from './pure/Initialisation.svelte';
	import { onMount } from 'svelte';
	import { Utils } from '$lib/classes/Utils'
	import { customEvents } from '$lib/audio/EventHandlers';
	import { VoiceOver } from '$lib/classes/Speech';

	export let patch: string;
	export let bg: boolean = false;
	export let spin: boolean = false;
	
	let pathPatch: string = `/cables/${patch}/patch.js`;	

	$: if (spin) { 
		CablesText.set( [ Utils.rotateString($CablesText[0]), Utils.rotateString($CablesText[1]) ] )
		spinText($CablesText) 
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
		alert('An error occured: ' + errId + ', ' + errMsg);
	}

	function patchInitialized() {
		console.log('Cables Patch initialized');
	} 

	async function  patchFinishedLoading() {
		$CablesIsLoaded = true;
		$CablesAudioContext = CABLES.WEBAUDIO.getAudioContext()
		spinText();	
	}



	function spinText(  prompts:string[] = ["End","Proc"]  ) {
	if ( $CablesIsLoaded ) {
			$CablesPatch.config.spinAndPrompt('',prompts[0],prompts[1]) // bug in Cables won't pass first arg
		}
	}

	onMount( () => {
		initializeCables();
		})

	</script>

<svelte:head>
	<!-- todo: move this data load server side -->
	<script src={pathPatch}></script>
</svelte:head>

<div class="mb-4 ">
	<canvas 
		id="cables_{patch}"
		width="100%"
		height="100%"
		style="width: 100%; height: 100%; z-index: {bg? -137: 0}; position: fixed;"
	/>
	<Initialisation />
</div>
