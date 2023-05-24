<script lang="ts">
	/**
	 * @description 
	 * invokes the Cables visualiser patch running in the background 
	 * and also initialises the audio renderers
	 * @todo
	 * deal with possibility that Cables does not load
	 * or Canvas is not available
	*/

	import Cables from '$lib/components/animation/Cables.svelte';
	import Initialisation from '$lib/components/pure/Initialisation.svelte';
	export let spin: boolean;

</script>

<Cables patch="ENDPROC010" bg={true} bind:spin />
<Initialisation />

        