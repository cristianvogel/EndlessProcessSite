<script lang="ts">


    import { Icon } from '@steeze-ui/svelte-icon';
    import { VoiceActivate } from'@steeze-ui/carbon-icons';
    import ElevenLabsLogo from '$lib/images/ElevenLabsLogo.svelte';
	import { ProgressBar, SlideToggle } from '@skeletonlabs/skeleton';
    import { VFS_PATH_PREFIX, OutputMeters, PlaylistMusic, RendererStatus, Decoded } from '$lib/stores/stores';
    import { tweened } from 'svelte/motion';
	import {  bounceInOut } from 'svelte/easing';
	import { AudioMain } from '$lib/classes/Audio';
	import { fade } from 'svelte/transition';

    let activated: boolean = false;

    // Tweened progress bar as VU-meter
    $: progress.set(Math.abs(Math.round( 100 * ($OutputMeters.SpeechAudible as number ))));

    const progress = tweened(0, {
		duration: 100,
		easing: bounceInOut
	});

    const speechActivatedAnim = tweened(0, {
        duration: 1000,
        easing: bounceInOut
    });
    
    function done(element: HTMLElement) {speechActivatedAnim.set(1)};
    function voiceActivated(e: any) {
     	PlaylistMusic.update((p) => {
			p.currentChapter ={...p.currentChapter, 
                title: e.currentTarget.name,
                vfsPath: $VFS_PATH_PREFIX + e.currentTarget.name,
                progress: 0 
            };
			return p;
		});
        AudioMain.playSpeechFromVFS( activated ? 1 : 0);
    }
</script>

{#if ($RendererStatus.speech === 'ready') && $Decoded.done }
 <div data-comment use:done />
{/if}

<div class='absolute grid grid-rows-3 grid-cols-3 grid-flow-col gap-1 p-0 mt-16' style='opacity: {$speechActivatedAnim}'>
    <div>
        <Icon src={VoiceActivate} 
        class='w-9 p-1 fill-secondary-200 rounded-md '/>
     </div>
    <div class='w-20 opacity-90 -mt-8' >
        <ElevenLabsLogo fill="white" stroke='antiquewhite' width="80%" transX="-6"/>
    </div>
    
    <div class="-mt-5" in:fade> 
        <SlideToggle 
        name="Chapter 1" 
        bind:checked={activated} 
        size='sm' 
        active='bg-secondary-600'
        rounded='rounded-md'
        on:change={voiceActivated}
        />
    </div>
    <div class="col-start-2 row-start-3 mt-3 -mr-10  ">
    	<ProgressBar
		label="Progress Bar"
		value={$progress * 4}
		meter="bg-gradient-to-r from-blue-800 to-green-600"
		rounded="rounded-1"
        height="h-2"
		min={0}
		max={100}
	/> 
    </div>
</div>

