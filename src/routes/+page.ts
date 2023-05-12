
/**
* @name MediaItems CMS QL 
**/

import type { PageLoad } from './$types';
import type { AssetCategories } from '../typeDeclarations';


export const prerender = false;

const apiURL = 'https://endless-process.net/graphql';

// set preflight headers
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Request-Headers': 'Content-Type, Range'
}

const query = {
  MPEGs: `query GetMusicFromCMS {
          mediaItems(where: {mimeType: AUDIO_MPEG}) {
            edges {
              node {
                mediaItemUrl
                fileSize
                caption
                title
                Speech {
                  chapter
                }
              }
            }
          }
        }`
};

//------------------ Load In -------------------
export const load = (async ({ fetch }) => {

  async function fetchMediaItems(category?: AssetCategories) {
    const response = await fetch(apiURL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: query.MPEGs })
    });
    const serialisedResponse = response.json();
    return await (serialisedResponse);
  }

// ------------------ Load Out -------------------
  return {
    streamedMetaData: {
      MPEGs: fetchMediaItems()
    }
  };
}) satisfies PageLoad;
