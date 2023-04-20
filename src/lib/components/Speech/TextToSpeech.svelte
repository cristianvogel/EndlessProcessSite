<script lang="ts">
    import { Icon } from '@steeze-ui/svelte-icon';
    import { VoiceActivate } from'@steeze-ui/carbon-icons';
    import {VoiceOver} from '$lib/classes/Speech';
    import ElevenLabsLogo from '$lib/images/ElevenLabsLogo.svelte';
	import { SlideToggle } from '@skeletonlabs/skeleton';
    import { VFS_PATH_PREFIX, PlaylistSpeech } from '$lib/stores/stores';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

    let activated: boolean = false;

    function voiceActivated(e: any) {
        if (VoiceOver.status === 'suspended') {
			VoiceOver.resumeContext();
		}

        const currentChapter = {
            title: e.currentTarget.name,
            vfsPath: get(VFS_PATH_PREFIX) + e.currentTarget.name,
            progress: 0,
            duration: $PlaylistSpeech.durations.get(e.currentTarget.name),
            offset: 0
        }

     	PlaylistSpeech.update((p) => {
			p.currentChapter = currentChapter;
			return p;
		});

        VoiceOver.playFromVFS();
    }

    onMount(() => {     
        VoiceOver.init();
        })


</script>

<div class='grid grid-rows-3 grid-flow-col gap-0 p-0 mt-4 '>
    <div>
        <Icon src={VoiceActivate} 
        class='w-9 p-1 fill-secondary-200 rounded-md '/>
     </div>
    <div class='w-20 opacity-90 -mt-8' >
        <ElevenLabsLogo fill="white" stroke='antiquewhite' width="80%" transX="-6"/>
    </div>
    <div class="-mt-5"> 
        <SlideToggle 
        name="voice::demo.mp3.channel.1" 
        bind:checked={activated} 
        size='sm' 
        active='bg-secondary-600'
        rounded='rounded-md'
        on:change={voiceActivated}
        />
    </div>
</div>