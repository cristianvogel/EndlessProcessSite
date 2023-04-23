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


	export let data: PageData

	const musicBuffers = data.music;
	const speechBuffers = data.speech;

	$: if( $MusicCoreLoaded )
	
	 {  musicBuffers.forEach( async (buffer)  => {
		const { path, response } = buffer;
		const title = path.replace(/.*\/([^/]+)$/, '$1') as string;	
		if (response.ok)
		{		
			await response.arrayBuffer().then( (body) => {
				console.log('body?', body)
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
				Audio.updateVFS(promisingAudioBuffer, 
								Audio._core )
			})
				
        } else {
            throw error(404, 'Music file load failed. 🔇');
        }
	})};

		$: if( $SpeechCoreLoaded )
	 {  speechBuffers.forEach( async (buffer)  => {
		const { path, response } = buffer;
		const title = path.replace(/.*\/([^/]+)$/, '$1') as string;	
		if (response.ok)
		{		
			await response.arrayBuffer().then( (body) => {
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
				Audio.updateVFS(promisingAudioBuffer, 
								VoiceOver._core )
			})
				
        } else {
            throw error(404, 'speech file load failed. 🔇');
        }
	})};

	

</script>