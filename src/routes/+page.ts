/**
 * Audio file ingestor
 * Will  fetch target URL from the Playlist store
 * I do this in +layout.ts because I want to make the assets available to the entire app
 * trying to avoid reloading the same assets on page navigation
 */

import { PlaylistMusic, PlaylistSpeech } from '$lib/stores/stores';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

type ResponseAndPath = { path: string, response: Response };
let final: { music: Array<ResponseAndPath>, speech: Array<ResponseAndPath> };
let pathlist: Array<string>;


export const load = (async ({ fetch }) => {

    pathlist = get(PlaylistMusic).audioAssetPaths;
    console.log('+ music load..⬇︎', pathlist)

    let musicData: Array<ResponseAndPath> = [];

    for (let i = 0; i < pathlist.length; i++) {
        const path = pathlist[i];
        const loadFrom: string = `${path}`;
        const stopwatch = Date.now();
        musicData.push(
            {
                path,
                response: await fetch(loadFrom)
            });
        console.log('Fetched music asset: ', loadFrom, Date.now() - stopwatch, 'ms');
    }

    final = { ...final, music: musicData }



    pathlist = get(PlaylistSpeech).audioAssetPaths;
    console.log('+ speech load..⬇︎', pathlist)
    let speechData: Array<ResponseAndPath> = [];
    for (let i = 0; i < pathlist.length; i++) {
        const path = pathlist[i];
        const loadFrom: string = `${path}`;
        const stopwatch = Date.now();
        speechData.push(
            {
                path,
                response: await fetch(loadFrom)
            });
        console.log('Fetched speech asset: ', loadFrom, Date.now() - stopwatch, 'ms');
    }

    final = { music: musicData, speech: speechData }

    return { final };
}) satisfies PageLoad
