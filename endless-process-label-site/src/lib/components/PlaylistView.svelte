<script lang="ts">
// todo: improve using approach on https://www.skeleton.dev/utilities/popups
import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
import { Icon } from '@steeze-ui/svelte-icon';
import  {CircleDash, CircleFilled} from '@steeze-ui/carbon-icons';
import {Audio} from '$lib/stores/AudioEngine';

export let tracklisting:Array<string>;

let valueSingle: number;
const dividerClass = 'my-12 h-0.5 border-t-0 bg-primary-300 opacity-100 dark:opacity-50'

$: current = Audio.currentTrackName;
</script>

 <ListBox> 	
    <h2 class="text-2xl text-tertiary-600 font-bold">Featured Playlist</h2>
    <hr class={dividerClass} />	
 {#each tracklisting  as title,i}
	<ListBoxItem 
    on:click
    on:change
    bind:group={valueSingle} 
    name={title} 
    value={i}>
    <svelte:fragment slot='lead'>
        <span class="text-tertiary-400">
            <Icon src={current === title ? CircleFilled : CircleDash} class="h-4 mt-1"/>
        </span>
    </svelte:fragment>
    {title} 
</ListBoxItem>
<hr class={dividerClass} />

{/each}
</ListBox>
