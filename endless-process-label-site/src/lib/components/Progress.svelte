<script lang="ts">
	import { Playlist } from "$lib/stores/stores";
	import { Audio } from "$lib/classes/Audio";
	import { ProgressBar } from "@skeletonlabs/skeleton";
  import { Scrubbing } from "$lib/stores/stores";


    $: progress = $Playlist.currentTrack.progress ;
    $: duration = ($Playlist.currentTrack.duration ) || 0; // in seconds

    let start: number = 0;

    // function to make the progress bar click and draggable
    function handleScrub(e: any) {
        if(!$Scrubbing) return;
        const { clientX, target } = e;
        const { left, width } = target.getBoundingClientRect();
        const x = clientX - left;
        const percent = x / width;
        start = Math.round((percent * duration) * 1000) ; // to ms
        Audio.playWithScrubFromVFS({
            trigger: 0, 
            startOffset: start
        });   
    }

    function replay () {
        $Scrubbing = false;
        Audio.playWithScrubFromVFS( {trigger: 1, startOffset: start });
    }

</script>

<div id="parent">
    <ProgressBar label="Progress Bar" 
    value={progress * duration } 
    height='h-[0.5em]'
    meter='bg-gradient-to-r from-yellow-600 to-red-600'
    rounded='rounded-1'
    min={0}
    max={duration}  />
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="invisible-div" 
    on:mousedown={(e)=>{$Scrubbing=true; handleScrub(e)}} 
    on:mousemove={handleScrub} 
    on:mouseup={replay}
    on:mouseleave={()=>{$Scrubbing=false}}>
</div>
</div>

<style>
  #parent {
    position: relative;
  }

  #invisible-div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 30px;
    opacity: 0;
  }

</style>
