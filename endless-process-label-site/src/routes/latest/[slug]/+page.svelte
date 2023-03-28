<script lang="ts">
  import type { PageData } from './$types';
	import AudioPlayer from '$lib/components/AudioPlayer.svelte';
  import { currentPost } from '$lib/stores/stores';

  export let data: PageData;

</script>

  <div class='m-0 p-6 bg-gradient-to-br from-surface-500 to-surface-800 ml-1 rounded-s'>
    <div class='bg-transparent p-3 text-warning-400 opacity-80'>
      <h6 class='subheading'>{$currentPost.cardIndex}</h6>
      <h1 class=''>{$currentPost.title}</h1>
    </div>
  <section class='columns-2 p-3 '>
  {#if $currentPost.content }
     <article 
     class=
     "prose dark:prose-invert 
     prose-img:rounded-xl
     break-inside-avoid-column
     prose-xl
     leading-normal
     ">
      {@html $currentPost.content}
    </article>
        <div class='bg-secondary-800 p-3 rounded-lg text-tertiary-400 text-right opacity-80'>
          <ul>
          <li><a class='!no-underline' href='/'>Listen links</a></li>

        </ul>
       
        <span class='flex justify-end'><AudioPlayer/></span>
        
      </div>
  {/if}
  </section>
  </div>