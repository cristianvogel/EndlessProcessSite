/**
 * Audio file ingestor
 * Will  fetch target URL from the Playlist store
 * I do this in +layout.ts because I want to make the assets available to the entire app
 * trying to avoid reloading the same assets on page navigation
 */

import { PlaylistMusic } from '$lib/stores/stores';
import { get } from 'svelte/store';
import type { LayoutLoad } from './$types';
import { formatTitleFromGlobalPath } from '$lib/classes/Utils';

type AssetLoadResponse = {
    title: string,
    path: string,
    response: Response
};

/**
 * @todo: Consolidate into one function
 */
export const load = (async ({ fetch }) => {

    async function resolver(pathlist: string[]) {

        let result: Array<AssetLoadResponse> = [];
        for (let i = 0; i < pathlist.length; i++) {
            const path = pathlist[i];
            const stopwatch = Date.now();
            const title = formatTitleFromGlobalPath(path);
            result.push(
                {
                    title,
                    path,
                    response: await fetch(path)
                });
            console.log('Resolving asset from: ', path, ' in ', Date.now() - stopwatch, 'ms. Title rewritten to: ', title);
        }
        return result;
    }
    return {
        music: resolver(get(PlaylistMusic).audioAssetPaths.music),
        speech: resolver(get(PlaylistMusic).audioAssetPaths.speech)
    };
}) satisfies LayoutLoad
