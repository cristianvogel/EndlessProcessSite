<script lang="ts">
	import {Howl, Howler} from 'howler';
  import { ProgressBar } from '@skeletonlabs/skeleton';


    let value = 0;
// Setup the new Howl.


const sound = new Howl({
  src: ['/src/lib/audio/sound.mp3']
});

// Play the sound.
// sound.play();

// Change global volume.
Howler.volume(0.5);

// get progress of sound
sound.on('play', function(){
  setInterval(function(){
    value = sound.seek() / sound.duration();
  }, 100);
});

</script>

<!-- <span id='TopAudioPlayer'>
    <ProgressBar  
    bind:value={value} 
    max={1} 
    height={'h-2' } 
    labelledby='Audio Player' />
</span> -->

<audio controls src="http://localhost:10004/wp-content/uploads/2023/03/synthesized_audio.mp3"></audio>