<script lang="ts">

	import Cables from '$lib/components/Cables.svelte';
	import { CablesIsLoaded } from '$lib/stores/stores';
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	export let spin: boolean;

</script>

<!-- Loading spinner -->
{#if !$CablesIsLoaded  } 
		<div class="absolute inset-0 flex justify-center items-center">
			<ProgressRadial 
			value={ undefined }
			font= {12}
			width='w-50' 
			stroke={5} 
			meter="stroke-secondary-500" 
			track="stroke-secondary-300/30" />
		</div>
{/if}

<Cables patch="ENDPROC010" bg={true} bind:spin />


        