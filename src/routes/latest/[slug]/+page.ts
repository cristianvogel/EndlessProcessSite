// todo: actually get the post data from the API
// this is placeholder code and is not being used

import type { PageLoad } from "./$types";

let postTitle = '';

export const prerender = 'auto';

const query = `
    query getPostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        date
        title
        content
        author {
          node {
            name
          }
        }
        categories {
          nodes {
            name
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
      }
    }
  `;


const apiURL = 'https://endless-process.net/graphql';

export const load = (async ({ params }) => {
	postTitle = params.slug;

	const response = await fetch(apiURL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			query,
			variables: {
				slug: postTitle
			}
		})
	});

	try {
		if (!response.ok) {
			throw new Error(`Could not load post. Status: ${response.status}`);
		}

		const responseObj = await response.json();
		const { post } = responseObj.data;
		return {
			post,
			title: params.slug
		};
	} catch (error) {
		console.log('Error:', error);
		return {
			error: error
		};
	}
}) satisfies PageLoad;
