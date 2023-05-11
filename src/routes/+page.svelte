<script lang="ts">

	import type { PageData } from './$types';
	import { Decoded } from '$lib/stores/stores';
	import AssetLoader from '$lib/components/Data/AssetLoader.svelte';
	export let data: PageData;
</script>

{#if !$Decoded.done }
	<AssetLoader metadata={data} category='music'/>
	<AssetLoader metadata={data} category='speech'/>
{/if}

