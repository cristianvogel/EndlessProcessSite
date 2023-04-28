	
	<script lang='ts'>

		import { onMount } from "svelte";

		let isMobile:boolean | undefined = false;

	 	onMount(() => {
			isMobile =   /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
		})

	</script>


	<div class='grid md:grid-cols-16 md:grid-rows-2 text-[10px] text-surface-200 place-items-end fading-bg p-2 -mb-2'>
		<div class='col-start-1 col-span-2 place-self-start'>
				:: Design and programming by
		</div>
		<div class='col-start-1 col-span-2 place-self-start '>
			<a  href='mailto:cristian@endless-process.net'>
				:: Julia Decay © 2023 
			</a>
		</div>
	{#if !isMobile}
			<div class='col-start-13 col-span-3 row-start-1 '>
				 made with ::
			</div>
			<div class='col-start-13 col-span-3 row-start-2'>
				<a class='' href="https://kit.svelte.dev/">
				SvelteKit</a>・
				<a class="" href="https://cables.gl/home">
					<span>Cables.gl</span>
				</a>・
				<a class="" href="https://elementary.audio">
					<span>Elementary</span>
				</a>・
				<a class='' href="https://www.skeleton.dev">
					SkeletonUI
				</a>::
				</div>	

	{/if}	
</div>