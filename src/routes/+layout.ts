import { PlaylistMusic } from '$lib/stores/stores';
import { get } from 'svelte/store';
import type { LayoutLoad } from './$types';
import { formatTitleFromGlobalPath } from '$lib/classes/Utils';

export type PathInfo = {
    title: string,
    path: string
};

let musicFiles: any;
let speechFiles: any;
let fetchers = new Array<Promise<any>>

export const load = (async ({ fetch }) => {

    musicFiles = getPaths(get(PlaylistMusic).audioAssetPaths.music)
    speechFiles = getPaths(get(PlaylistMusic).audioAssetPaths.speech)
    fetchers = fetchBuffers(musicFiles.paths)

    function getPaths(pathlist: string[]) {

        const results = {
            titles: new Array<string>,
            paths: new Array<string>,
        }

        for (let i = 0; i < pathlist.length; i++) {
            const path = pathlist[i];
            const title = formatTitleFromGlobalPath(path);
            results.titles.push(title);
            results.paths.push(path);
        }
        return { titles: results.titles, paths: results.paths }
    }


    function fetchBuffers(pathlist: string[]) {

        for (let i = 0; i < pathlist.length; i++) {
            const path = pathlist[i];
            fetchers.push(fetch(path))
        }

        return fetchers
    }
    return {
        music: musicFiles,
        speech: speechFiles,
        streamed: {
            buffers: Promise.all(fetchers).then(async responses => {
                let final = new Array<ArrayBuffer>()
                for (let i = 0; i < responses.length; i++) {
                    final.push(await responses[i].arrayBuffer())
                }
                return final
            })
        }
    }
}) satisfies LayoutLoad
