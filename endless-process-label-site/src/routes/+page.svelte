<script>
	import AnimatedLogo from "$lib/components/AnimatedLogo.svelte";

</script>


<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-10 text-center">
		<h2 class="font-bold bg-gradient-to-br from-red-500 to-yellow-500 bg-clip-text text-transparent box-decoration-clone">
			Welcome to Endless Process
		</h2>
		<!-- Animated Logo -->
		<figure>
			<section class="img-bg" />
			<a href="/blog" >
			<!-- <img src="../src/lib/images/EP_logo.svg" alt="main logo" /> -->
			<AnimatedLogo />
			</a>
		</figure>
		<!-- / -->
		<h3 class="font-bold text-secondary-400">Home of the hits.</h3>
		<hr class="!border-t-8 !border-double" />
	</div>
</div>

<!--
	pulsing figure
-->

