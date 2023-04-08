<script>
	// Splash opening
	import SplashSVG from '$lib/components/SplashSVG.svelte';
	import { Playlist } from '$lib/stores/stores';
	import { Icon } from '@steeze-ui/svelte-icon';
	import TestAudioComponent from './TestAudioComponent.svelte';
	import { Scan } from '@steeze-ui/carbon-icons';
	import DescriptionList from './DescriptionList.svelte';

</script>


<div class="container mx-auto my-10 w-80 flex justify-center items-start " on:mousedown>
	<div class="space-y-10 text-center">
		<h2
			class="font-bold bg-gradient-to-br from-red-500 to-yellow-500 bg-clip-text text-transparent box-decoration-clone"
		>
			Welcome to Endless Process
		</h2>
			<a href="/blog" data-sveltekit-noscroll>
				<SplashSVG />
				<!-- <TestAudioComponent /> -->
			</a>
		
		{#if $Playlist.currentTrack.name !== '' }
		   
				<DescriptionList>
					<span slot='Title'>{$Playlist.currentTrack}</span>
					<span slot='Description'>a new track</span>
				
				Current Track
				</DescriptionList>
		{:else}
		   <h3 class="font-bold text-zinc">𝐍-Dimensional<br>Music.</h3>
		{/if}	
		<hr class="!border-t-8 !border-double" />
	</div>
</div>


