<script lang="ts">
	import { Playlist } from "$lib/stores/stores";
	import { ProgressBar } from "@skeletonlabs/skeleton";

    $: progress = $Playlist.currentTrack.progress ;
    $: duration = ($Playlist.currentTrack.duration ) || 0;


</script>

<ProgressBar label="Progress Bar" 
value={progress * duration} 
height='h-[0.1em]'
meter='bg-gradient-to-r from-yellow-600 to-red-600'
rounded='rounded-1'
min={0}
max={duration} />
