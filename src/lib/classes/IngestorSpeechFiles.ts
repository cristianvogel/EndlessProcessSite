/**
 * Audio file ingestor  -- SPEECH
 * It duplicates the behaviour of the load() function in src/routes/+layout.ts
 * @todo: refactor all file loading to be done in the same SvelteKit +load function?
 * not sure how to do that yet...
 */

import { get } from 'svelte/store';
import { LoadingSomething, PlaylistSpeech, VFS_PATH_PREFIX } from '$lib/stores/stores';
import type { SpeechContainer, ArrayBufferContainer } from '../../typeDeclarations';
import { error } from '@sveltejs/kit';

// const sourceURL_prefix = get(AUDIO_ASSETS_PREFIX) + '/speech/';
let pathlist: Array<string>;

const unsubscribe = PlaylistSpeech.subscribe((container) => {
	pathlist = container.audioAssetPaths;
});

const target = (entry: string, i: number): string => `${entry}`;

// export async function load({ fetch }) {

// 	let responses: Array<any> = [];
// 	let promisingAudioBuffers: Array<Promise<any>> = [];

// 	LoadingSomething.update(($loading) => {
// 		$loading.count += pathlist.length;
// 		$loading.state = true;
// 		return $loading;
// 	})

// 	for (let i = 0; i < pathlist.length; i++) {
// 		const entry = pathlist[i];
// 		const loadFrom: string = target(entry, i);
// 		console.log('Fetching speech ', loadFrom);
// 		const stopwatch = Date.now();
// 		responses.push(await fetch(loadFrom));
// 		console.log(' in ', Date.now() - stopwatch, 'ms');
// 	}

// 	for (let i = 0; i < responses.length; i++) {
// 		const response = responses[i];

// 		const rawArrayBuffer = async () => {
// 			return await response.arrayBuffer();
// 		};

// 		if (response.ok) {
// 			const title = 'voice::' + pathlist[i].replace(/.*\/([^/]+)$/, '$1') as string;
// 			const promisingAudioBuffer: ArrayBufferContainer = {
// 				header: {
// 					title,
// 					bytes: 0,
// 					globPath: pathlist[i]
// 				},
// 				body: rawArrayBuffer()
// 			};
// 			const wrap = async () => {
// 				return promisingAudioBuffer;
// 			};
// 			promisingAudioBuffers.push(wrap());
// 		} else {
// 			throw error(404, 'Audio file load failed. 😿');
// 		}
// 	}
// 	unsubscribe();
// 	LoadingSomething.update(($loading) => {
// 		$loading.count += pathlist.length;
// 		$loading.state = false;
// 		return $loading;
// 	})
// 	return { buffers: promisingAudioBuffers };
// }
