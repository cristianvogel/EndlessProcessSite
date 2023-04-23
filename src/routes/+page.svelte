<script lang="ts">
	/**
	 * @description
	 * Parallel Assets Worker
	 */
	import type { PageData } from './$types';
	import { Audio } from '$lib/classes/Audio';
	import type { ArrayBufferContainer } from '../typeDeclarations';
	import { VFS_PATH_PREFIX, PlaylistMusic, LayoutDataLoaded } from '$lib/stores/stores';
	import { get } from 'svelte/store';
	import { error } from '@sveltejs/kit';
	import { mapToRange } from '$lib/classes/Utils';
	import type WebAudioRenderer from '@elemaudio/web-renderer';


	export let data: PageData;

/**
	 * @description Parallel Assets Worker
	 * Resolve all the promises in the data.buffers array
	 * then construct another array of promises which intends to decode
	 * the buffers in parallel. Then resolve that array to update
	 * the VFS and playlist with the decoded buffers.
	 * 🚨 These methods don't work properly with for...each loops
	 * @todo abstract out the parallel decoder
	 */

	const buffers = data.responses;

	buffers.forEach( async (buffer)  => {
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
            throw error(404, 'Audio file load failed. 🔇');
        }
	});

	

</script>