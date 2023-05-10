
/**
* @name Media Asset PageLoad
**/

import type { PageLoad } from './$types';

export const prerender = false;

const query = `query GetMedia {
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

export const load = (async ({ fetch }) => {

  function fetchMetaData() {
    return fetch(apiURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    }).then(response => {
      const serialisedResponse = response.json();
      return (serialisedResponse)
    })
  }

  return {
    streamedMetaData: {
      metadata: fetchMetaData(),
    },
  }
}) satisfies PageLoad;

