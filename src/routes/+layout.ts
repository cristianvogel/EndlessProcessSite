/**
 * Audio file ingestor
 * Will  fetch target URL from the Playlist store
 * I do this in +layout.ts because I want to make the assets available to the entire app
 * trying to avoid reloading the same assets on page navigation
 */

import { PlaylistMusic } from '$lib/stores/stores';
import { get } from 'svelte/store';
import type { LayoutLoad } from './$types';

type ResponseAndPath = { path: string, response: Response };
let final: { music: Array<ResponseAndPath>, speech: Array<ResponseAndPath> };
let pathlist: Array<string>;

/**
 * @todo: Consolidate into one function
 */
export const load = (async ({ fetch }) => {

    async function resolver(pathlist: string[]) {

        let result: Array<ResponseAndPath> = [];
        for (let i = 0; i < pathlist.length; i++) {
            const path = pathlist[i];
            const loadFrom: string = `${path}`;
            const stopwatch = Date.now();
            result.push(
                {
                    path,
                    response: await fetch(loadFrom)
                });
            console.log('Resolved asset from: ', loadFrom, ' in ', Date.now() - stopwatch, 'ms');
        }
        return result;
    }
    return {
        music: resolver(get(PlaylistMusic).audioAssetPaths.music),
        speech: resolver(get(PlaylistMusic).audioAssetPaths.speech)
    };
}) satisfies LayoutLoad
