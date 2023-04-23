/**
 * Audio file ingestor
 * Will  fetch target URL from the Playlist store
 * I do this in +layout.ts because I want to make the assets available to the entire app
 * trying to avoid reloading the same assets on page navigation
 */

import { PlaylistMusic } from '$lib/stores/stores';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

let pathlist: Array<string>;
pathlist = get(PlaylistMusic).audioAssetPaths;

export const load = (async ({ fetch }) => {

    const target = (entry: string, i: number): string => `${entry}`;
    console.log('+ load..⬇︎')
    let responses: Array<{ path: string, response: Response }> = [];

    for (let i = 0; i < pathlist.length; i++) {
        const path = pathlist[i];
        const loadFrom: string = target(path, i);
        const stopwatch = Date.now();
        responses.push(
            {
                path,
                response: await fetch(loadFrom)
            });
        console.log('Fetched: ', loadFrom, Date.now() - stopwatch, 'ms');
    }

    return { responses };
}) satisfies PageLoad
