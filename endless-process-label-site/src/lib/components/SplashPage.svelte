<script>
	// Splash opening
	import SplashSVG from '$lib/components/SplashSVG.svelte';

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
			</a>
		<h3 class="font-bold text-zinc">𝐍-Dimensional<br>Music.</h3>
		<hr class="!border-t-8 !border-double" />
	</div>
</div>


