<script lang="ts" >
	import BlogPosts from '$lib/components/Blog/BlogPosts.svelte';
/**
 * Blog posts layout page
*/

  import type { PageServerData } from './$types';


  export let data: PageServerData;
  
</script>  

{#await (data.streamed.posts)}
<BlogPosts loaded={false}/>
{:then responseObject}
 
  {@const blogPosts = responseObject.data.posts.nodes } 
<BlogPosts loaded={true} {blogPosts}/>

{:catch error}
	<div class="card h-20 w-80% m-10 text-m p-1 text-red-500"  > {error} 🤷🏽  </div>
{/await}
