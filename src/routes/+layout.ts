import { PlaylistMusic } from '$lib/stores/stores';
import { get } from 'svelte/store';
import type { LayoutLoad } from './$types';
import { formatTitleFromGlobalPath } from '$lib/classes/Utils';
import type { AssetContainers } from '../typeDeclarations';

type TitlesAndPaths = { titles: string[], paths: string[] }
type Assets = {
    files: AssetContainers,
    fetchers: AssetContainers,
    buffers: AssetContainers
}

export const load = (async ({ fetch }) => {

    let assets: Assets = {
        files: {
            music: getPaths(get(PlaylistMusic).audioAssetPaths.music) as TitlesAndPaths,
            speech: getPaths(get(PlaylistMusic).audioAssetPaths.speech) as TitlesAndPaths
        },
        buffers: {
            music: new Array<ArrayBuffer>(),
            speech: new Array<ArrayBuffer>()
        },
        fetchers: {
            music: new Array<Promise<Response>>(),
            speech: new Array<Promise<Response>>()
        }
    }

    assets = {
        ...assets,
        fetchers: {
            music: fetchBuffers('music', assets.files.music.paths),
            speech: fetchBuffers('speech', assets.files.speech.paths)
        }
    }

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


    function fetchBuffers(category: 'music' | 'speech', pathlist: string[]) {
        for (let i = 0; i < pathlist.length; i++) {
            const path = pathlist[i];
            assets.fetchers[category].push(fetch(path))
        }
        return assets.fetchers[category]
    }

    //-----------------Load Out-----------------//
    return {
        music: assets.files.music,
        musicStreamed: {
            buffers: Promise.all(assets.fetchers.music).then(async responses => {
                let final = new Array<ArrayBuffer>()
                for (let i = 0; i < responses.length; i++) {
                    final.push(await responses[i].arrayBuffer())
                }
                return final
            }
            )
        },
        speech: assets.files.speech,
        speechStreamed: {
            buffers: Promise.all(assets.fetchers.speech).then(async responses => {
                let final = new Array<ArrayBuffer>()
                for (let i = 0; i < responses.length; i++) {
                    final.push(await responses[i].arrayBuffer())
                }
                return final
            })
        }
    }
}) satisfies LayoutLoad
