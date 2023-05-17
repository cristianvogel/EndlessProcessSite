<script lang="ts">

	import Cables from '$lib/components/Cables.svelte';
	import { CablesIsLoaded } from '$lib/stores/stores';

	export let spin: boolean;

</script>


{#if !$CablesIsLoaded  } 
	<!-- Loading spinner? -->	
{/if}

<Cables patch="ENDPROC010" bg={true} bind:spin />


        