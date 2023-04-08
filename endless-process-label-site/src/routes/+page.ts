/**
 * Prototype of an audio loader
 * Will get fetch target URL from the Playlist
 */

import { get } from 'svelte/store';
import { Playlist } from '$lib/stores/stores';
import type { RawAudioBuffer } from 'src/typeDeclarations.js';

const sourceURL_prefix = '/src/lib/audio/';
const { playlist } = get(Playlist);

const target = (entry: string, i: number): string => `${sourceURL_prefix}${entry}`;

export async function load({ fetch }) {
	console.log('Playlist is ', playlist);

	let responses: Array<any> = [];
	let rawAudioBuffers: Array<RawAudioBuffer> = [];

	for (let i = 0; i < playlist.length; i++) {
		const entry = playlist[i];
		const loadFrom: string = target(entry, i);
		console.log('Loading ', loadFrom);
		responses.push(await fetch(loadFrom));

		console.log('responses ', responses.length);
	}

	for (let i = 0; i < responses.length; i++) {
		const response = responses[i];
		let samplesBuffer = await response.arrayBuffer();
		if (response.ok && samplesBuffer.byteLength > 1) {
			console.log('sampleBuffer fetch ok');
			rawAudioBuffers.push({
				header: {
					name: playlist[i],
					bytes: samplesBuffer.byteLength,
					vfsPath: sourceURL_prefix + playlist[i]
				},
				body: samplesBuffer
			});
		}
	}

	console.log('rawAudioBuffers ', rawAudioBuffers);
	return { buffers: rawAudioBuffers };
}


// export async function load({ fetch }) {
// 	const response: Response = await fetch(target);
// 	let sampleBuffer: ArrayBuffer = await response.arrayBuffer();

// 		console.log('sampleBuffer fetch ok');
// 		const result: RawAudioBuffer = {
// 			header: {
// 				name: playlist[0],
// 				bytes: sampleBuffer.byteLength,
// 				vfsPath: target
// 			},
// 			body: sampleBuffer
// 		};
// 		return result;

// 	//todo: handle error with SvelteKit error page
// 	if (!response || !sampleBuffer || sampleBuffer.byteLength < 1) throw error(404);
// }
