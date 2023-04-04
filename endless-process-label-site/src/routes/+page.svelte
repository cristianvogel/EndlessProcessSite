<script lang='ts'>
	// Landing page
	import type { PageData } from './$types';
	import {CablesPatch, CablesAudioFileURL, Samples } from '$lib/stores/stores';
	import {Audio} from '$lib/stores/AudioEngine';

	const { endNodes, isPlaying } = Audio.stores
	$: cablesEndNode = $endNodes.cables as GainNode;
	export let data: PageData;

	console.log('Page data audio?: ', data);
	if (data.body) {
		Samples.set(data.body);
	}

</script>

<main>
<div class="w-full  p-1 bg-transparent text-xs" >
	<!-- possibility for an audio player here -->		
			{#if $CablesPatch}
			<span class='info'>
				<span > 〇 </span> 
				{#if cablesEndNode}
				  Cables volume ▶︎ {cablesEndNode.gain.value}
				{/if}	
				 : Playing {$isPlaying} : {$CablesAudioFileURL[0]}
			</span>
		{/if}
</div>
</main>