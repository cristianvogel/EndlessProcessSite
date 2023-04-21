<script lang="ts">
	/**
	 * @description
	 * Parallel Assets Worker
	 */
	import type { LayoutData } from './$types';
	import { Audio } from '$lib/classes/Audio';
	import type { ArrayBufferContainer } from 'src/typeDeclarations';
	import { VFS_PATH_PREFIX, PlaylistMusic, LayoutDataLoaded } from '$lib/stores/stores';
	import { get } from 'svelte/store';

	export let data: LayoutData;

/**
	 * @description Parallel Assets Worker
	 * Resolve all the promises in the data.buffers array
	 * then construct another array of promises which intends to decode
	 * the buffers in parallel. Then resolve that array to update
	 * the VFS and playlist with the decoded buffers.
	 * 🚨 These methods don't work properly with for...each loops
	 * @todo abstract out the parallel decoder
	 */


if (data.buffers?.length > 0) {
	LayoutDataLoaded.update(($ldl) => {$ldl=true; return $ldl});
	let parallel: Array<any> = [];
	
	Promise.all(data.buffers).then((buffers) => {
		for (let i = 0; i < buffers.length; i++) {
			const track: ArrayBufferContainer = buffers[i];

			const vfsPath = get(VFS_PATH_PREFIX) + track.header.title;
			const header = { ...track.header, vfsPath };
			parallel.push(async () => {
				const decoded: ArrayBuffer = await track.body;
				return Audio.updateVFS({
					header,
					body: decoded
				}, PlaylistMusic, Audio );
			});
		}

		Promise.all(parallel.map((func) => func())).then(() =>
			console.log('AUDIO: Parallel promises resolved')
		);
	});

} else {
	console.log('AUDIO: No buffers to decode');
}
</script>
