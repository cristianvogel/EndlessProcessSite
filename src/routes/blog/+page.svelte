<script lang="ts" >

/**
 * Blog posts layout page
*/

  import type { PageData } from './$types';
  import BlogPosts from '$lib/components/BlogPosts.svelte';

  export let data: PageData;

</script>  

{#if data}
  <BlogPosts {data}/>
{:else}
	<div class="card h-20 w-80% m-10 text-m p-1 text-red-500"  > Err... no posts? 🤷🏽  </div>
{/if}