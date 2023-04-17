<!-- files.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { Icon } from '@steeze-ui/svelte-icon';
  import { Layers } from '@steeze-ui/carbon-icons';
  import { Playlist } from '$lib/stores/stores';
  import { getFiles } from '$lib/classes/Files';

  let fileNames: Array<string> = [];

  onMount(() => {
  Playlist.update( (plist) => {
    fileNames = plist.playlist  = getFiles(); 
    return plist});
  });
  
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
    {#each fileNames as fileName}
      <li class='ml-1'>{fileName}</li>
    {/each}
  </ul>