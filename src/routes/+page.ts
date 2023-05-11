
/**
* @name Media Asset PageLoad
**/

import { getPaths, getSpeechFiles as getSpeechPaths } from '$lib/classes/Files';
import type { PageLoad } from './$types';
import type { AssetCategories, TitlesPaths } from '../typeDeclarations';

export const prerender = false;

const query = `query GetMusicFromCMS {
  mediaItems(where: {mimeType: AUDIO_MPEG}) {
    edges {
      node {
        mediaItemUrl
        fileSize
        caption
        title
      }
    }
  }
}`;

const apiURL = 'https://endless-process.net/graphql';

// set preflight headers
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Request-Headers': 'Content-Type, Range'
}

export const load = (async ({ fetch }) => {

  async function fetchMetaDataFor(category: AssetCategories, speechFiles?: TitlesPaths) {
    switch (category) {
      case 'music': {
        const response = await fetch(apiURL, {
          method: 'POST',
          headers,
          body: JSON.stringify({ query })
        });
        const serialisedResponse = response.json();
        return await (serialisedResponse);
      }
      case 'speech': {
        if (!speechFiles) { throw new Error('No paths provided') }
        const serialisedResponse = JSON.stringify(speechFiles);
        return (serialisedResponse);
      }
      default: {
        throw new Error('Unknown metadata category');
      }
    }
  }
//---- Load out -------------------
  return {
    streamedMetaData: {
      music: fetchMetaDataFor('music'),
      speech: fetchMetaDataFor('speech', getPaths(getSpeechPaths()))
    }
  }
}) satisfies PageLoad;







/**
 * @todo:mobile throttling
 **/

  // const isMobile = () => {
  //   if (typeof window !== 'undefined') {
  //     return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  //   }
  //   console.warn('Unable to detect device type. Assuming desktop.');
  // };
  // console.log(isMobile() ? 'Mobile' : 'Desktop');
  // if (isMobile()) { pathlist = pathlist.slice(0, Math.max(1, Math.round(pathlist.length / 2))) }