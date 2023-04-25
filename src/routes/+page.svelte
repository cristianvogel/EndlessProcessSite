<script lang="ts">
	/**
	 * @description
	 * Parallel Assets Worker
	 */
	import type { LayoutData } from './$types';
	import { Audio } from '$lib/classes/Audio';
	import type { ArrayBufferContainer } from '../typeDeclarations';
	import { VFS_PATH_PREFIX, PlaylistMusic, MusicCoreLoaded, SpeechCoreLoaded } from '$lib/stores/stores';
	import { get } from 'svelte/store';
	import { error } from '@sveltejs/kit';
	import { VoiceOver } from '$lib/classes/Speech';
	import type { AssetLoadResponse } from './+layout';

	export let data: LayoutData

	const musicBuffers:AssetLoadResponse[] = data.music;
	const speechBuffers:AssetLoadResponse[] = data.speech;
    const prefix = get(VFS_PATH_PREFIX);

$: if( $MusicCoreLoaded ) {  
loadAudioBuffers(musicBuffers, 'music');
}

$: if( $SpeechCoreLoaded ) {
loadAudioBuffers(speechBuffers, 'speech');
}

async function loadAudioBuffers(buffers: AssetLoadResponse[], type: 'music' | 'speech') {
  const promises: Promise<void>[] = buffers.map(async (buffer) => {
    const { path, response, title } = buffer;
    if (response.ok) {
      try {
        const body = await response.arrayBuffer();
        const promisingAudioBuffer: ArrayBufferContainer = {
          header: {
            title,
            bytes: body.byteLength,
            globPath: path,
            vfsPath: `${prefix}${path}`
          },
          body
        };
        PlaylistMusic.update(($p) => {
          $p.titles[type].push(title);
          return $p;
        });
        Audio.updateVFS(promisingAudioBuffer, type === 'music' ? Audio._core : VoiceOver._core);
      } catch (e) {
         console.warn( `${e.message}` );
      }
    } else {
      throw error(404, `${type} file load failed. 🔇`);
    }
  });

   Promise.all(promises);
}


	

</script>