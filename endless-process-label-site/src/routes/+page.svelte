<script>
	// Landing page
	import { Icon } from '@steeze-ui/svelte-icon';
	import { CaretSortDown  } from '@steeze-ui/carbon-icons';
	import {CablesPatch, CablesAudioFileURL} from '$lib/stores/stores';
</script>

<main>
<div class="w-full  p-1 bg-transparent text-xs" >
	<!-- possibility for an audio player here -->
		
			<a href="/blog"><Icon src={CaretSortDown} class="h-8 animate-pulse"/></a>
			{#if $CablesPatch}
			<span class='text-sm'>
				Patch initialised : Playing {$CablesAudioFileURL[0]}
			</span>
		{/if}
</div>
</main>