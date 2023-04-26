<script lang="ts" >

/**
 * Blog posts layout page
*/

  import type { PageServerData } from './$types';
  import BlogPosts from '$lib/components/Blog/BlogPosts.svelte';

  export let data: PageServerData;

</script>  

{#await (data.streamed.posts)}
<BlogPosts loaded={false}/>
{:then responseObject}
 
  {@const nodes = responseObject.data.posts.nodes } 
  <BlogPosts loaded={true} blogPosts={nodes}/>
 
{:catch error}
	<div class="card h-20 w-80% m-10 text-m p-1 text-red-500"  > {error} 🤷🏽  </div>
{/await}
