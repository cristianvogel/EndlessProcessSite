/**
 * Audio file ingestor
 * Will  fetch target URL from the Playlist store
 * I do this in +layout.ts because I want to make the assets available to the entire app
 * trying to avoid reloading the same assets on page navigation
 */

import { LoadingSomething, PlaylistMusic } from '$lib/stores/stores';
import type { RawAudioBuffer } from 'src/typeDeclarations.js';
import { error } from '@sveltejs/kit';

let pathlist: Array<string>;

const unsubscribe = PlaylistMusic.subscribe((container) => {
	pathlist = container.audioAssetPaths;
});

const target = (entry: string, i: number): string => `${entry}`;

export async function load({ fetch }) {

	let responses: Array<any> = [];
	let promisingAudioBuffers: Array<Promise<any>> = [];

	LoadingSomething.update(($loading) => {
		$loading.count += pathlist.length;
		$loading.state = true;
		return $loading;
	})

	for (let i = 0; i < pathlist.length; i++) {
		const entry = pathlist[i];
		const loadFrom: string = target(entry, i);
		console.log('Fetching ', loadFrom);
		const stopwatch = Date.now();
		responses.push(await fetch(loadFrom));
		console.log(' in ', Date.now() - stopwatch, 'ms');
	}

	for (let i = 0; i < responses.length; i++) {
		const response = responses[i];
		const rawArrayBuffer = async () => {
			return await response.arrayBuffer();
		};

		if (response.ok) {
			const title = pathlist[i].replace(/.*\/([^/]+)$/, '$1') as string;
			const promisingAudioBuffer: RawAudioBuffer = {
				header: {
					title,
					bytes: 0,
					globPath: pathlist[i]
				},
				body: rawArrayBuffer()
			};
			const wrap = async () => {
				return promisingAudioBuffer;
			};
			promisingAudioBuffers.push(wrap());
		} else {
			throw error(404, 'Audio file load failed. 😿');
		}
	}
	unsubscribe();
	return { buffers: promisingAudioBuffers };
}
