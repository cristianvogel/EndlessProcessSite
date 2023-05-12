<script lang="ts">

	import type { PageData } from './$types';
	import { Decoded } from '$lib/stores/stores';
	import AssetLoader from '$lib/components/remote/AssetLoader.svelte';
	export let data: PageData;
</script>

{#if !$Decoded.done }
	<AssetLoader metadata={data} />
{/if}

