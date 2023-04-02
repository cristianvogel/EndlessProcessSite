<script lang="ts">
import SinglePost from '$lib/components/SinglePost.svelte';
import type { PageData } from './$types';
export let data: PageData;

</script>

<SinglePost {data}/>