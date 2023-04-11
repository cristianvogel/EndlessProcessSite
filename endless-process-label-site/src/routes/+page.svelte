<script lang='ts'>
	// Landing page route
	import type { LayoutData } from './$types';
	import { Audio } from '$lib/stores/AudioEngine';
	export let data: LayoutData;

	// parallel array of promises refined with the help of ChatGPT3
	// https://chat.openai.com/chat/8bb60bdf-3a51-49d6-bc42-c097c015982b

let parallel: Array<any> = [];

Promise.all(data.buffers).then(buffers => {
  for (let i = 0; i < buffers.length; i++) {
    const track = buffers[i];
    parallel.push(async () => {
      const buffer = await track.body;
      return Audio.updateVFS({
        header: track.header,
        body: buffer
      });
    });
  }

  Promise.all(parallel.map(func => func())).then(tracks => {
    console.log('All ',tracks.length,' audio tracks decoded 🤖 ');
    // set the current track to the first track loaded from the playlist
    if (!Audio.currentTrackName || Audio.currentTrackName === '') {
       Audio.currentTrackName = buffers[0].header.name;
    }
  });
});


</script>
