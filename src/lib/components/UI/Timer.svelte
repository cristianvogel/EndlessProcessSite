<!-- https://eugenkiss.github.io/7guis/tasks#timer -->

<script lang='ts'>
	import { onMount } from 'svelte';
	let last_time = 0
    let elapsed = 0;
    
    $:elapsed = Date.now() - last_time;

    onMount(() => {
        last_time = Date.now();
    })
</script>


<div class='info'>
	<progress value={elapsed} max=100000></progress>
</div>




