<script lang="ts">
	// fire off the loaded file in the VFS

	import { Audio } from '$lib/stores/AudioEngine';
	import { Samples } from '$lib/stores/stores';

	const { audioStatus } = Audio.stores;

	$: isPlaying = $audioStatus === 'playing';

	if ($Samples?.byteLength > 0) {
		Audio.updateVFS($Samples);
	}
</script>

<div class="w-full  p-1 bg-transparent text-xs">
	<span class="info">
		<span> 〇 </span>
		: Playing {isPlaying}
	</span>
	{#if $Samples?.byteLength > 0}
		<div class="info">Audiobuffer loaded. VFS updated.</div>
	{/if}
</div>
