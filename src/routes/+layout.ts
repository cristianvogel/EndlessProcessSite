/**
 * Audio file ingestor
 * Will  fetch target URL from the Playlist store
 * I do this in +layout.ts because I want to make the assets available to the entire app
 * trying to avoid reloading the same assets on page navigation
 */

import { get } from 'svelte/store';
import { AUDIO_ASSETS_PREFIX, Playlist, VFS_PATH_PREFIX } from '$lib/stores/stores';
import type { PlaylistContainer, RawAudioBuffer } from 'src/typeDeclarations.js';
import { error } from '@sveltejs/kit';

let playlist: Array<string>;

const unsubscribe = Playlist.subscribe((container: PlaylistContainer) => {
	playlist = container.playlist;
});

const target = (entry: string, i: number): string => `${entry}`;

export async function load({ fetch }) {
	let responses: Array<any> = [];
	let rawAudioBuffers: Array<Promise<any>> = [];

	for (let i = 0; i < playlist.length; i++) {
		const entry = playlist[i];
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
			const name = playlist[i].replace(get(AUDIO_ASSETS_PREFIX), '');
			const structuredAudioBuffer: RawAudioBuffer = {
				header: {
					name,
					bytes: 0,
					vfsPath: get(VFS_PATH_PREFIX) + name
				},
				body: rawArrayBuffer()
			};
			const wrap = async () => {
				return structuredAudioBuffer;
			};
			rawAudioBuffers.push(wrap());
		} else {
			throw error(404, 'ArrayBuffer fetch failed 😿');
		}
	}
	unsubscribe();
	return { buffers: rawAudioBuffers };
}
