<script lang="ts">
	/**
	 * @description
	 * Parallel Assets Worker
	 */
	import type { PageData } from './$types';
	import { Audio } from '$lib/classes/Audio';
	import type { ArrayBufferContainer } from '../typeDeclarations';
	import { VFS_PATH_PREFIX, PlaylistMusic, MusicCoreLoaded, SpeechCoreLoaded } from '$lib/stores/stores';
	import { get } from 'svelte/store';
	import { error } from '@sveltejs/kit';
	import { VoiceOver } from '$lib/classes/Speech';
	import { Warning } from 'postcss';


	export let data: PageData

	const musicBuffers = data.music;
	const speechBuffers = data.speech;

$: if( $MusicCoreLoaded ) {  
    musicBuffers.forEach(async (buffer) => {
        const { path, response } = buffer;
        const title = path.replace(/.*\/([^/]+)$/, '$1') as string;   
        if (response.ok) {        
            try {
                const body = await response.arrayBuffer();
                console.log('body?', body);
                const promisingAudioBuffer: ArrayBufferContainer = {
                    header: {
                        title,
                        bytes: 0,
                        globPath: path,
                        vfsPath: `${get(VFS_PATH_PREFIX)}${path}`
                    },
                    body
                };                 
                PlaylistMusic.update(($p) => {
                    $p.titles.music.push(title);
                    return $p;
                });
                Audio.updateVFS(promisingAudioBuffer, Audio._core)
            } catch (e) {
               console.warn( (429, `${e.message}`) );
            }
        } else {
            throw error(404, 'Music file load failed. 🔇');
        }
    });
}

$: if( $SpeechCoreLoaded ) {
    speechBuffers.forEach(async (buffer) => {
        const { path, response } = buffer;
        const title = path.replace(/.*\/([^/]+)$/, '$1') as string;
        if (response.ok) {        
            try {
                const body = await response.arrayBuffer();
                const promisingAudioBuffer: ArrayBufferContainer = {
                    header: {
                        title,
                        bytes: 0,
                        globPath: path,
                        vfsPath: `${get(VFS_PATH_PREFIX)}${path}`
                    },
                    body
                };
                PlaylistMusic.update(($p) => {
                    $p.titles.speech.push(title);
                    return $p;
                });
                Audio.updateVFS(promisingAudioBuffer, VoiceOver._core)
            } catch (e) {
                 console.warn( (429, `${e.message}`) );
            }
        } else {
            throw error(404, 'Speech file load failed. 🔇');
        }
    });
}


	

</script>