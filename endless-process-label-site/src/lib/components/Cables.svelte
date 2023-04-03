<script lang="ts">
	
	import { 
			CablesAudioFileURL, 
			CablesPatch,
			CablesText
		} from '$lib/stores/stores';
	import { Audio } from '$lib/stores/AudioEngine';
	import { onMount } from 'svelte';
	import { Utils } from '$lib/classes/Utils';
	import { tick } from 'svelte';

	export let patch: string;
	export let bg: boolean = false;
	export let spin: boolean = false;

	const { endNodes } = Audio.stores
		
	let pathPatch: string = `src/lib/cables/${patch}/patch.js`;	
	$: loadedTrack =  $CablesAudioFileURL[0] 
	$: if (spin) { 
		CablesText.set( [ Utils.rotateString($CablesText[0]), Utils.rotateString($CablesText[1]) ] )
		spinText($CablesText) 
	}
	
	$: tick().then( ()=> {
		if (typeof $CablesPatch !== 'string' ) {
			$CablesPatch.getVar('CablesGainNode').on("change", 
			(function( newValue:GainNode ) {
				if (!newValue || $endNodes.cables != null ) return
				console.log ( 'Patched valid Cables end node', newValue)
				Audio.cablesEndNode = newValue;	
				Audio.connectEndNodes();
   			 }))
		} else {
			// spinner whilst CablesPatch loads?
			CablesText.set( [ Utils.rotateString($CablesText[0]), Utils.rotateString($CablesText[1]) ] )
		}
	})
	

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
		console.log('Cables Patch initialized');
		Audio.init(CABLES.WEBAUDIO.getAudioContext());
		console.log('Initialising AudioEngine (with CablesAudioContext) and', Audio.audioStatus);			
	} 

	function patchFinishedLoading() {
		spinText(["Endless", "Process"])
	}

	function spinText(  prompts:string[] = ["End","Proc"]  ) {
	if ( typeof $CablesPatch !== 'string' ) {
			$CablesPatch.config.spinAndPrompt('',prompts[0],prompts[1]) // bug in Cables won't pass first arg
		}
	}

	onMount(() => {
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
</div>
