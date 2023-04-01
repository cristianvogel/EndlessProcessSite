<script>
	// Landing page
	import {CablesPatch, CablesAudioFileURL} from '$lib/stores/stores';
</script>

<main>
<div class="w-full  p-1 bg-transparent text-xs" >
	<!-- possibility for an audio player here -->
		
			
			{#if $CablesPatch}
			<span class='text-sm'>
				Patch initialised : Playing {$CablesAudioFileURL[0]}
			</span>
		{/if}
</div>
</main>