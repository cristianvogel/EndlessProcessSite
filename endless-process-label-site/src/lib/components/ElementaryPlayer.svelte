<script lang="ts">

import {_AudioEngine as AudioEngine, audioStatus} from '../stores/stores';
import {detunedSaws} from '$lib/audio/synths';
import {el} from '@elemaudio/core';
	import { onMount } from 'svelte';


onMount(() => {
    $AudioEngine.init(new AudioContext());
});

$:isPlaying = $audioStatus === 'playing';
$:buttonPrompt = !isPlaying ? 'Play' : 'Stop';

function handleClick(ev:MouseEvent){
    if ($AudioEngine.ctx?.state !=='running') $AudioEngine.resume();

    if(!isPlaying) {
        $AudioEngine.render( {
                L:detunedSaws( { ampMod: el.cycle(1.0) }, el.const( {key: 'L1', value: 60} ) ),
                R:detunedSaws({ ampMod: el.cycle(0.5) }, el.const( {key: 'R1', value: 60.618} ) )
            } )
    } else {
        $AudioEngine.mute();
    }
}
	
</script>
{#if $AudioEngine}
    <button class="rounded-full bg-secondary-500 text-xs p-2" on:click={handleClick} >
    { buttonPrompt } Audio 
</button>
{/if}