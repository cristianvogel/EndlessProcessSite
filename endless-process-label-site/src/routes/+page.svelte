<script>
	import Cables from '$lib/components/Cables.svelte';
	import Splash from '$lib/components/Splash.svelte';
</script>


<Cables patch="ENDPROC010" />
<div class="container  h-full mx-auto flex justify-center items-center">
	
	<div class="space-y-10 text-center">
		<h2
			class="font-bold bg-gradient-to-br from-red-500 to-yellow-500 bg-clip-text text-transparent box-decoration-clone"
		>
			Welcome to Endless Process
		</h2>
		<!-- Animated Logo -->
		<figure>
			<a href="/blog">
				<Splash />
			</a>
		</figure>
		<!-- / -->
		<h3 class="font-bold text-secondary-400">Home of the hits.</h3>
		<hr class="!border-t-8 !border-double" />
	</div>
</div>
