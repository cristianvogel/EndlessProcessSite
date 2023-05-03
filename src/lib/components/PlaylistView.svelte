<script lang="ts">
/**
 @todo: improve with https://www.skeleton.dev/utilities/popups
 */
import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
import { Icon } from '@steeze-ui/svelte-icon';
import  {CircleDash, CircleFilled} from '@steeze-ui/carbon-icons';
import {Audio} from '$lib/classes/Audio';
import { Utils, formatTitleFromGlobalPath } from '$lib/classes/Utils';
import { handlePlaylistChoice } from '$lib/functions/handlePlaylistChoice';

export let tracklisting:Array<string>;

let valueSingle: number;

const dividerClass = 'my-12 h-0.5 border-t-0 bg-primary-800 opacity-100 dark:opacity-50'

$: current = Audio.currentTrackTitle;


</script>

 <ListBox> 	
	<div class='text-xs ml-2 -mt-0.5 pl-0.5 absolute right-5'>{Utils.formatDate(new Date())}</div>
    <h2 class="text-2xl text-secondary-300 font-bold p-2 rounded-lg">
		Featured Music</h2>
		
    <hr class={dividerClass} />	
 {#each tracklisting  as title,i}
	<ListBoxItem 
    on:click={handlePlaylistChoice}
    bind:group={valueSingle} 
    name={title} 
    value={i}>
    <svelte:fragment slot='lead'>
        <span class="text-tertiary-400">
            <Icon src={current === title ? CircleFilled : CircleDash} class="h-4 mt-1"/>
        </span>
    </svelte:fragment>
	<div class='gradient-text text-md '> {formatTitleFromGlobalPath(title)}</div>
 
	
</ListBoxItem>
<hr class={dividerClass} />

{/each}
</ListBox>
