<script lang="ts">
    import { Icon } from '@steeze-ui/svelte-icon';
    import { VoiceActivate } from'@steeze-ui/carbon-icons';
    import ElevenLabsLogo from '$lib/images/ElevenLabsLogo.svelte';
	import { SlideToggle } from '@skeletonlabs/skeleton';
    import { VFS_PATH_PREFIX, Voice } from '$lib/stores/stores';
	import type { VoiceContainer } from 'src/typeDeclarations';

    let activated: boolean = false;

    function voiceActivated(e: any) {

        Voice.update( (voice:VoiceContainer) => {
            const data = e.target
            voice.status.active = data.checked;
            voice.currentChapterID = data.name;
            voice.VFSPath = $VFS_PATH_PREFIX + voice.currentChapterID;
            return voice;
        })
    }


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