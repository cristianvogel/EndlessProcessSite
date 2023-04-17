<script lang="ts" >

/**
 * Blog posts layout page
*/

  import type { PageData } from './$types';
  import BlogPosts from '$lib/components/BlogPosts.svelte';

  export let data: PageData;

</script>  

<BlogPosts {data}/>
