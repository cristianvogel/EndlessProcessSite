/**
 * Audio file ingestor
 * Will  fetch target URL from the Playlist store
 * I do this in +layout.ts because I want to make the assets available to the entire app
 * trying to avoid reloading the same assets on page navigation
 */

import { PlaylistMusic, LayoutDataLoaded } from '$lib/stores/stores';
import type { ArrayBufferContainer } from 'src/typeDeclarations.js';
import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';


let pathlist: Array<string>;

const target = (entry: string, i: number): string => `${entry}`;

export async function load({ fetch }) {

    console.log('Already ingested?', get(LayoutDataLoaded));
    if (get(LayoutDataLoaded)) {
        return { buffers: [] };
    }
    pathlist = get(PlaylistMusic).audioAssetPaths;
    let responses: Array<any> = [];
    let promisingAudioBuffers: Array<Promise<any>> = [];

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
            const promisingAudioBuffer: ArrayBufferContainer = {
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
    return { buffers: promisingAudioBuffers };
}
