<script lang="ts">

	import type { PageData } from './$types';
	import { Decoded } from '$lib/stores/stores';
	import AssetLoader from '$lib/components/remote/AssetLoader.svelte';
	import { resumeContext } from '$lib/classes/Audio';
	export let data: PageData;
</script>

<svelte:window on:mousedown={resumeContext}></svelte:window>

{#if !$Decoded.done }
	<AssetLoader metadata={data} />
{/if}

