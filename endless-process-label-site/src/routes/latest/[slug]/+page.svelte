<script lang="ts">
	import AudioPlayer from '$lib/components/AudioPlayer.svelte';
  import { currentPostTitle, currentPostContent } from '$lib/stores/stores';

  let postTitle = '';
  let postContent = '';
  currentPostTitle.subscribe(value => {value ? postTitle = value : postTitle = 'no title'});
  </script>

  <div class='m-0 p-6 bg-gradient-to-br from-surface-500 to-surface-800 ml-1 rounded-s'>
    <div class='bg-transparent p-3 text-warning-400 opacity-80'>
      <h1 class=''>{postTitle}</h1>
    </div>
  <section class='columns-2 p-3 '>
  {#if $currentPostContent }
     <article 
     class=
     "prose dark:prose-invert 
     prose-img:rounded-xl
     break-inside-avoid-column
     prose-xl
     leading-normal
     ">
      {@html $currentPostContent}
    </article>
        <div class='bg-secondary-800 p-3 rounded-lg text-tertiary-400 text-right opacity-80'>
          <ul>
          <li><a class='!no-underline' href='/'>{postTitle}</a></li>

        </ul>
       
        <span class='flex justify-end'><AudioPlayer/></span>
        
      </div>
  {/if}
  </section>
  </div>