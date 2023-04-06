<script lang="ts">
	// fire off the loaded file in the VFS

	import { Audio } from '$lib/stores/AudioEngine';
	import { RawAudioBufferStore } from '$lib/stores/stores';

	const { audioStatus } = Audio.stores;

	$: isPlaying = $audioStatus === 'playing';

</script>

<div class="w-full  p-1 bg-transparent text-xs">
	<span class="info">
		<span> 〇 </span>
		: Playing {isPlaying}
	</span>
	{#if $RawAudioBufferStore }
		<div class="info"> AudioBufferStore: {$RawAudioBufferStore.header.vfsPath}</div>
	{/if}
</div>
