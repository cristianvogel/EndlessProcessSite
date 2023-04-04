<script lang="ts">
// Single post view
import AudioPlayer from '$lib/components/EmbeddedAudioPlayer.svelte';
import { singlePost } from '$lib/stores/stores';
const { content, title } = $singlePost

export let data: any;

</script>

  <div class='m-0 p-6 bg-gradient-to-br from-surface-500 to-surface-800 opacity-95 m-3'>
    <div class='bg-transparent p-3 text-warning-400 opacity-80'>
      <h6 class='subheading'>{$singlePost.cardIndex}</h6>
      <h1 class=''>{$singlePost.title}</h1>
    </div>
  <section class='columns-2 p-3 '>
  
  {#if content }
     <article 
     class=
     "prose dark:prose-invert 
     prose-img:rounded-xl
     break-inside-avoid-column
     prose-xl
     leading-normal
     ">
      {@html content.sanitisedHTML  }
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
