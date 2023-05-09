import { ContextSampleRate, PlaylistMusic } from '$lib/stores/stores';
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
let final = new Array<ArrayBuffer>()

//-----------------Load Out-----------------//
export const load = (async ({ fetch }) => {
    categories.forEach((category) => {
        let paths: any = get(PlaylistMusic)
        paths = getPaths(paths.audioAssetPaths[category]) as TitlesAndPaths
        assets = {
            files: {
                [category]: paths,
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
                buffers: assets.fetchers[category]
            }
        }
    });
    return loadOut
}) satisfies LayoutLoad


//-----------------Hoisted Helpers-----------------//
function getPaths(pathlist: string[]) {
    const results = {
        titles: new Array<string>,
        paths: new Array<string>,
    }
    console.log(isMobile() ? 'Mobile browser, loading less music' : 'Desktop');
    if (isMobile()) { pathlist = pathlist.slice(0, Math.max(1, Math.round(pathlist.length / 2))) }
    for (let i = 0; i < pathlist.length; i++) {
        const path = pathlist[i];
        const title = formatTitleFromGlobalPath(path);
        results.titles.push(title);
        results.paths.push(path);
    }
    return { titles: results.titles, paths: results.paths }
}

function fetchBuffers({ fetch }: any, category: AssetCategories, pathlist: string[]) {
    // actually, the excerptDuration calc is not SR related, but kbps...
    // the speech is 64kbps but the music is 320 vbr
    const excerptDuration = get(ContextSampleRate) * 60
    const clippingConditions =
    {
        mobile: (category === 'music' && isMobile()),
        playExcerpt: (category === 'music'),
        playFull: false
    }
    const headers = clippingConditions.playExcerpt ? {
        Range: `bytes=0-${excerptDuration}`
    } : {};
    for (let i = 0; i < pathlist.length; i++) {
        const path = pathlist[i];
        assets.fetchers[category].push(fetch(path, { headers }))
    }
    return assets.fetchers[category]
}
// mobile throttling
const isMobile = () => {
    if (typeof window !== 'undefined') {
        return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    }
};