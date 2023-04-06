<script lang='ts'>
	// Landing page route
	import type { PageData } from './$types';
	import { Samples } from '$lib/stores/stores';
	

	export let data: PageData;

	if (data.body) {
		$Samples = data.body;
	}

</script>
