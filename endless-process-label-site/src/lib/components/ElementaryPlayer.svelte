<script lang="ts">
	import { Audio } from '$lib/stores/AudioEngine';
	import { Icon } from '@steeze-ui/svelte-icon';
	import {PauseOutline, PlayOutline} from '@steeze-ui/carbon-icons';
	const { audioStatus } = Audio.stores

	$: isPlaying = $audioStatus === 'playing';

</script>

{#if $audioStatus !==  'loading' || 'closed ' }
	<div class="flex justify-start">
	<button class= { isPlaying ? 
	'rounded-full bg-secondary-600 p-0' :
	'rounded-full bg-secondary-800 p-0' }
	on:mousedown >
		<Icon src= { isPlaying ? PauseOutline : PlayOutline } 
		class={ isPlaying ? 
		'h-8 fill-secondary-200' : 
		'h-8 fill-secondary-300 animate-pulse' }
		data-sveltekit-noscroll />
	</button>
	</div>
{/if}
