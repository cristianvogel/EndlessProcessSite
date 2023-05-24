<script lang="ts">

	import { resumeContext } from '$lib/classes/Audio';
	import AssetLoader from '$lib/components/remote/AssetLoader.svelte';
	import { Decoded } from '$lib/stores/stores';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:window on:mousedown={resumeContext}></svelte:window>

{#if !$Decoded.done }
	<AssetLoader metadata={data} />
{/if}

