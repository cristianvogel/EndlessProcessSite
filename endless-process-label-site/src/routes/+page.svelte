<script lang='ts'>
	// Landing page route
	import type { PageData } from './$types';
	import { get } from 'svelte/store';
	import { Audio } from '$lib/stores/AudioEngine';
	import { RawAudioBufferStore } from '$lib/stores/stores';
	
	export let data: PageData;

	data.buffers.forEach( buffer  => {
		console.log('Page data => ', buffer.header, buffer.body);
	});


	// if (data.body) {
	// 	RawAudioBufferStore.set( { header: data.header, body: data.body} );
	// 	Audio.updateVFS( get(RawAudioBufferStore)  );
	// }

	
</script>

