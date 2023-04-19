<script lang="ts">
    import { Icon } from '@steeze-ui/svelte-icon';
    import { VoiceActivate } from'@steeze-ui/carbon-icons';
    import {VoiceOver} from '$lib/classes/Voice';
    import ElevenLabsLogo from '$lib/images/ElevenLabsLogo.svelte';
	import { SlideToggle } from '@skeletonlabs/skeleton';
    import { VFS_PATH_PREFIX, PlaylistSpeech } from '$lib/stores/stores';
	import { onMount } from 'svelte';

    let activated: boolean = false;

    function voiceActivated(e: any) {
        if (VoiceOver.status === 'suspended') {
			VoiceOver.resumeContext();
		}
        PlaylistSpeech.update( (plist) => {
            const data = e.target
            const current = plist.currentChapter;
            VoiceOver.status = data.checked ? 'playing' : 'paused';
            current.id = data.id;
            current.name = data.name;
            current.path = $VFS_PATH_PREFIX + current.id;
            return plist;
        })
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
        name="speech.1" 
        bind:checked={activated} 
        size='sm' 
        active='bg-secondary-600'
        rounded='rounded-md'
        on:change={voiceActivated}
        />
    </div>
</div>