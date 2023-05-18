<script lang="ts">

	import type { PageData } from './$types';
	import { Decoded, ForceAudioContextResume } from '$lib/stores/stores';
	import AssetLoader from '$lib/components/remote/AssetLoader.svelte';
	export let data: PageData;
</script>
<svelte:window on:mousedown={$ForceAudioContextResume}></svelte:window>
{#if !$Decoded.done }
	<AssetLoader metadata={data} />
{/if}

