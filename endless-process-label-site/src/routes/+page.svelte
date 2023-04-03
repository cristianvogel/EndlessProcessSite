<script lang='ts'>
	// Landing page
	import {CablesPatch, CablesAudioFileURL} from '$lib/stores/stores';
	import {Audio} from '$lib/stores/AudioEngine';

	const { endNodes, isPlaying } = Audio.stores
	$: cablesEndNode = $endNodes.cables as GainNode;

</script>

<main>
<div class="w-full  p-1 bg-transparent text-xs" >
	<!-- possibility for an audio player here -->		
			{#if $CablesPatch}
			<span class='text-8px'>
				<!-- Cables Gain Volume: {cablesEndNode.gain.value} -->
				<span > 〇 </span> 
				{#if cablesEndNode}
				  Cables volume ▶︎ {cablesEndNode.gain.value}
				{/if}	
				 : Playing {$isPlaying} : {$CablesAudioFileURL[0]}
			</span>
		{/if}
</div>
</main>