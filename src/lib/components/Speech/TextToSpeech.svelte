<script lang="ts">

/**
 * @todo this is a demo, has hardcoded VFS path
*/

    import { Icon } from '@steeze-ui/svelte-icon';
    import { VoiceActivate } from'@steeze-ui/carbon-icons';
    import {VoiceOver} from '$lib/classes/Speech';
    import ElevenLabsLogo from '$lib/images/ElevenLabsLogo.svelte';
	import { ProgressBar, SlideToggle } from '@skeletonlabs/skeleton';
    import { VFS_PATH_PREFIX, OutputMeters, PlaylistMusic } from '$lib/stores/stores';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	
    import { tweened } from 'svelte/motion';
	import {  quadInOut } from 'svelte/easing';

    let activated: boolean = false;

    $: progress.set(Math.round ($OutputMeters.SpeechAudible as number ))
    
    const progress = tweened(0, {
		duration: 100,
		easing: quadInOut
	});

    function voiceActivated(e: any) {
        if (VoiceOver.status === 'suspended') {
			VoiceOver.resumeContext();
		}

        const currentChapter = {
            title: e.currentTarget.name,
            vfsPath: get(VFS_PATH_PREFIX) + e.currentTarget.name,
            progress: 0,
        }

     	PlaylistMusic.update((p) => {
			p.currentChapter = currentChapter;
			return p;
		});

        VoiceOver.playFromVFS( activated ? 1 : 0);
    }

    onMount(() => {     
        VoiceOver.init();
        })


</script>

<div class='absolute grid grid-rows-3 grid-cols-3 grid-flow-col gap-1 p-0 mt-4  '>
    <div>
        <Icon src={VoiceActivate} 
        class='w-9 p-1 fill-secondary-200 rounded-md '/>
     </div>
    <div class='w-20 opacity-90 -mt-8' >
        <ElevenLabsLogo fill="white" stroke='antiquewhite' width="80%" transX="-6"/>
    </div>
    <div class="-mt-5"> 
        <SlideToggle 
        name="demo.mp3.channel.1" 
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
		value={$progress ** (1/3)}
		meter="bg-gradient-to-r from-blue-800 to-green-600"
		rounded="rounded-1"
        height="h-2"
		min={0}
		max={1}
	/>
    </div>
</div>

