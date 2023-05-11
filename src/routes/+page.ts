
/**
* @name MediaItems CMS QL 
**/

import type { PageLoad } from './$types';
import type { AssetCategories } from '../typeDeclarations';
import { queries } from '$lib/queries/mediaItemQueries';

export const prerender = false;

const apiURL = 'https://endless-process.net/graphql';

// set preflight headers
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Request-Headers': 'Content-Type, Range'
}

//------------------ Load In -------------------
export const load = (async ({ fetch }) => {

  async function fetchMetaDataFor(category: AssetCategories) {
    const response = await fetch(apiURL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: queries[category] })
    });
    const serialisedResponse = response.json();
    return await (serialisedResponse);
  }

// ------------------ Load Out -------------------
  return {
    streamedMetaData: {
      music: fetchMetaDataFor('music'),
      speech: fetchMetaDataFor('speech')
    }
  };
}) satisfies PageLoad;
