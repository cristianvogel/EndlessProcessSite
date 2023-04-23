<!-- files.svelte -->
<script lang="ts">
  import { Icon } from '@steeze-ui/svelte-icon';
  import { Layers } from '@steeze-ui/carbon-icons';
  import { PlaylistMusic } from '$lib/stores/stores';

 	let trackTitles:Array<string>;
	$: trackTitles = $PlaylistMusic.titles.music;

</script>
  <div class='flex items-center'>
  <div class='mr-1'>
  <Icon src={Layers} class="h-4 rotate-270"/> 
  </div> 
  <div class='text-sm'>
    <p>Virtual File System.</p>
  </div>  
  </div>
  <ul>
    {#each trackTitles as fileName}
      <li class='ml-1'>{fileName}</li>
    {/each}
  </ul>