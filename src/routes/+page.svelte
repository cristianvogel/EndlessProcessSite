<script lang="ts">
	/**
	 * @description
	 * Parallel Assets Worker
	 */
	import type { PageData } from './$types';
	import { Audio } from '$lib/classes/Audio';
	import type { ArrayBufferContainer } from '../typeDeclarations';
	import { VFS_PATH_PREFIX, PlaylistMusic, PlaylistSpeech, MusicCoreLoaded, SpeechCoreLoaded } from '$lib/stores/stores';
	import { get } from 'svelte/store';
	import { error } from '@sveltejs/kit';
	import type WebAudioRenderer from '@elemaudio/web-renderer';
	import { VoiceOver } from '$lib/classes/Speech';


	export let data: PageData

	const musicBuffers = data.final.music;
	const speechBuffers = data.final.speech;

	$: if( $MusicCoreLoaded )
	
	 {  musicBuffers.forEach( async (buffer)  => {
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
				Audio.updateVFS(promisingAudioBuffer, 
								PlaylistMusic,
								Audio._core as WebAudioRenderer)
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
				Audio.updateVFS(promisingAudioBuffer, 
								PlaylistSpeech,
								VoiceOver._core as WebAudioRenderer)
			})
				
        } else {
            throw error(404, 'speech file load failed. 🔇');
        }
	})};

	

</script>