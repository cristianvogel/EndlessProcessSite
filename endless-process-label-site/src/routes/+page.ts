/**
 * Prototype of an audio loader
 * Will get fetch target URL from the Playlist
 */

import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { Playlist } from '$lib/stores/stores';
import type { RawAudioBuffer } from 'src/typeDeclarations.js';

const sourceURL_prefix = '/src/lib/audio/';
const { playlist } = get(Playlist);

const target = `${sourceURL_prefix}${playlist[0]}`;

export async function load({ fetch }) {
	const response: Response = await fetch(target);
	let sampleBuffer: ArrayBuffer = await response.arrayBuffer();

	if (response.ok && sampleBuffer.byteLength > 1) {
		console.log('sampleBuffer fetch ok');
		const result: RawAudioBuffer = {
			header: {
				name: playlist[0],
				bytes: sampleBuffer.byteLength,
				vfsPath: target
			},
			body: sampleBuffer
		};
		return result;
	}

	//todo: handle error with SvelteKit error page
	if (!response || !sampleBuffer || sampleBuffer.byteLength < 1) throw error(404);
}
