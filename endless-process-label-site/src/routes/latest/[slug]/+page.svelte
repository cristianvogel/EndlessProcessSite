<script lang="ts">
	import { currentPostTitle, currentPostContent } from '$lib/stores/stores';
    import type { PageData } from './$types';
  
    export let data: PageData;
    let postTitle = '';
    let postContent = '';
    currentPostTitle.subscribe(value => {value ? postTitle = value : postTitle = 'no title'});
  </script>

  <div class='m-10 p-6 bg-surface-400 rounded-s h-2'>
    <div class='bg-secondary-700 p-3 text-tertiary-400 opacity-80'>
      <h1 class=''>{postTitle}</h1>
    </div>
  <section class='columns-2 p-3 '>
  {#if $currentPostContent }
     <div class='break-inside-avoid-column'>{@html $currentPostContent}</div>

        <div class='bg-secondary-800 p-3 rounded-lg text-tertiary-400 text-right opacity-80'>
          <ul>
          <li><a class='!no-underline' href='/'>{postTitle}</a></li>
          <li><a class='!no-underline' href='/blog'>..back</a></li>
        </ul>
        </div>

  {/if}
  </section>
  </div>