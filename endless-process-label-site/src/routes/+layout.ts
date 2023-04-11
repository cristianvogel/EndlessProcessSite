/**
 * Audio file ingestor
 * Will get fetch target URL from the Playlist store
 * todo: load all files from a folder.. maybe via a folder iterator that sets the playlist store property?
 */

import { get } from 'svelte/store';
import { Playlist, VFS_PATH_PREFIX } from '$lib/stores/stores';
import type { PlaylistContainer, RawAudioBuffer } from 'src/typeDeclarations.js';
import { error } from '@sveltejs/kit';

const sourceURL_prefix = get(VFS_PATH_PREFIX);
let playlist: Array<string> = [];

const unsubscribe = Playlist.subscribe((container: PlaylistContainer) => {
	playlist = container.playlist;
});

const target = (entry: string, i: number): string => `${sourceURL_prefix}${entry}`;

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
			const structuredAudioBuffer: RawAudioBuffer = {
				header: {
					name: playlist[i],
					bytes: 0,
					vfsPath: sourceURL_prefix + playlist[i]
				},
				body: rawArrayBuffer()
			};
			const wrap = async () => {
				return structuredAudioBuffer;
			};
			rawAudioBuffers.push(wrap());
		} else {
			console.log('ArrayBuffer fetch failed 😿');
			throw error(404);
		}
	}
	unsubscribe();
	return { buffers: rawAudioBuffers };
}
