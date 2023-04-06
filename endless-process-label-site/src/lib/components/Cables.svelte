<script lang="ts">
	
	import { 
			CablesPatch,
			CablesText,
			CablesIsLoaded,
			CablesAudioContext,
			Playlist
		} from '$lib/stores/stores';
	import { Audio } from '$lib/stores/AudioEngine';
	import { onMount } from 'svelte';
	import { Utils } from '$lib/classes/Utils';

	export let patch: string;
	export let bg: boolean = false;
	export let spin: boolean = false;

	const { endNodes } = Audio.stores
		
	let pathPatch: string = `src/lib/cables/${patch}/patch.js`;	
	$: loadedTrack =  $Playlist.currentTrack.name;
	$: if (spin) { 
		CablesText.set( [ Utils.rotateString($CablesText[0]), Utils.rotateString($CablesText[1]) ] )
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

	function patchFinishedLoading() {
		$CablesIsLoaded = true;
		$CablesAudioContext = CABLES.WEBAUDIO.getAudioContext()
		spinText(["Endless", "Process"]);
		Audio.init($CablesAudioContext);
		console.log('Initialising AudioEngine with CablesAudioContex', $CablesAudioContext.sampleRate,' Status: ', Audio.status);		
	}

	function spinText(  prompts:string[] = ["End","Proc"]  ) {
	if ( $CablesIsLoaded ) {
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
