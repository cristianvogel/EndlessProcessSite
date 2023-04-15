<script lang="ts">
// todo: improve using approach on https://www.skeleton.dev/utilities/popups
import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
import { Icon } from '@steeze-ui/svelte-icon';
import  {CircleDash, CircleFilled} from '@steeze-ui/carbon-icons';
import {Audio} from '$lib/stores/AudioEngine';
import { Playlist, VFS_PATH_PREFIX } from "$lib/stores/stores";

export let tracklisting:Array<string>;

let valueSingle: number;
const dividerClass = 'my-12 h-0.5 border-t-0 bg-primary-300 opacity-100 dark:opacity-50'

$: current = Audio.currentTrackName;

function HandlePlaylistChoice(e?:any, name?:string) {
		// can simulate event with a passed `name` value for programmatic track selection
		if (!e && name) { 
			e={currentTarget:{name:name}}; 
		};
		$Playlist.show = false;
		Audio.playWithScrubFromVFS( { trigger: 0, startOffset: 0 });
		Playlist.update( (plist) => {
			const { currentTrack } = plist;
			plist.currentTrack = {
				...currentTrack, 
				duration: plist.durations.get(e.currentTarget.name), 
				name: e.currentTarget.name,
				path: $VFS_PATH_PREFIX+e.currentTarget.name,
				progress: 0,
				offset: 0
			};
				//console.log('Current track from store: ',plist.currentTrack);
			return plist;
		});
		Audio.playWithScrubFromVFS( { trigger: 1, startOffset: 0 });
	}

</script>

 <ListBox> 	
    <h2 class="text-2xl text-tertiary-600 font-bold">Featured Music</h2>
    <hr class={dividerClass} />	
 {#each tracklisting  as title,i}
	<ListBoxItem 
    on:click={HandlePlaylistChoice}
    bind:group={valueSingle} 
    name={title} 
    value={i}>
    <svelte:fragment slot='lead'>
        <span class="text-tertiary-400">
            <Icon src={current === title ? CircleFilled : CircleDash} class="h-4 mt-1"/>
        </span>
    </svelte:fragment>
    {title.replace('.mp3', '')} 
</ListBoxItem>
<hr class={dividerClass} />

{/each}
</ListBox>
