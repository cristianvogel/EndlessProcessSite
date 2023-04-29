import { PlaylistMusic } from '$lib/stores/stores';
import { get } from 'svelte/store';
import type { LayoutLoad } from './$types';
import { formatTitleFromGlobalPath } from '$lib/classes/Utils';
import type { AssetCategories } from '../typeDeclarations';

type TitlesAndPaths = { titles: string[], paths: string[] }
type Assets = {
    files: Record<string, TitlesAndPaths>,
    buffers: Record<string, ArrayBuffer[]>,
    fetchers: Record<string, Promise<Response>[]>
}

let assets: Assets
let loadOut: any
const categories: AssetCategories[] = ['music', 'speech']

function getPaths(pathlist: string[]) {
    const results = {
        titles: new Array<string>,
        paths: new Array<string>,
    }

    // mobile throttling
    const isMobile = () => {
        if (typeof window !== 'undefined') {
            return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        }
        console.warn('Unable to detect device type. Assuming desktop.');
    };
    console.log(isMobile() ? 'Mobile' : 'Desktop');
    if (isMobile()) { pathlist = pathlist.slice(0, Math.max(1, Math.round(pathlist.length / 3))) }

    for (let i = 0; i < pathlist.length; i++) {
        const path = pathlist[i];
        const title = formatTitleFromGlobalPath(path);
        results.titles.push(title);
        results.paths.push(path);
    }
    return { titles: results.titles, paths: results.paths }
}

function fetchBuffers({ fetch }: any, category: AssetCategories, pathlist: string[]) {

    for (let i = 0; i < pathlist.length; i++) {
        const headers = {
            Range: `bytes=${0}-${44100 * 60}`
        };
        const path = pathlist[i];
        assets.fetchers[category].push(fetch(path, { headers }))
    }
    return assets.fetchers[category]
}

export const load = (async ({ fetch }) => {
    categories.forEach((category) => {

        assets = {
            files: {
                [category]: getPaths(get(PlaylistMusic).audioAssetPaths[category]) as TitlesAndPaths,
            },
            buffers: {
                [category]: new Array<ArrayBuffer>(),
            },
            fetchers: {
                [category]: new Array<Promise<Response>>()
            }
        }

        assets = {
            ...assets,
            fetchers: { [category]: fetchBuffers({ fetch }, category, assets.files[category].paths) }
        }

        loadOut = {
            ...loadOut,
            [category]: assets.files[category],
            [category + 'Streamed']: {
                buffers: Promise.all(assets.fetchers[category]).then(async responses => {
                    let final = new Array<ArrayBuffer>()
                    for (let i = 0; i < responses.length; i++) {
                        final.push(await responses[i].arrayBuffer())
                    }
                    return final
                })
            }
        }
    });

    //-----------------Load Out-----------------//
    return loadOut

}) satisfies LayoutLoad

