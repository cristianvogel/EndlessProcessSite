<script lang="ts">
import { goto } from '$app/navigation';
import SinglePost from '$lib/components/Blog/SinglePost.svelte';
import { singlePost } from '$lib/stores/stores';

function handleClose() {
    singlePost.update((post) => {
			post.isOpen = false;
			return post;
		});
  goto('/');
}

</script>

<SinglePost on:click={handleClose} on:keydown={handleClose}/>