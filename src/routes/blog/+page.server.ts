
import type { ServerLoad } from '@sveltejs/kit';

export const prerender = false;

const query = `
query GetPosts {
    posts {
      nodes {
        id
        title
        date
        content(format: RENDERED)
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
 `;
const apiURL = 'https://endless-process.net/graphql';

export const load = (async ({ fetch }) => {
  return {
		streamed: {
			posts: fetch(apiURL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ query })
			})
				.then(response => response.json())
		}
	}
}) satisfies ServerLoad;
