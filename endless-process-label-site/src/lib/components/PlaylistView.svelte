<script lang="ts">

import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
import { Icon } from '@steeze-ui/svelte-icon';
import  {Scan} from '@steeze-ui/carbon-icons';

export let tracklisting:Array<string>;

let valueSingle: number;
const dividerClass = 'my-12 h-0.5 border-t-0 bg-primary-300 opacity-100 dark:opacity-50'
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
        <span class="stroke-surface-600">
            <Icon src={Scan} class="h-8"/>
        </span>
    </svelte:fragment>
    {title} 
</ListBoxItem>
<hr class={dividerClass} />

{/each}
</ListBox>
