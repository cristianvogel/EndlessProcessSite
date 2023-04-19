import { error } from '@sveltejs/kit';
import { loadingSomething } from '$lib/stores/stores';
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

export async function load({ fetch }) {
	const interval = setInterval(() => {
		loadingSomething.update((load) => {
			load.state = true;
			load.count++;
			return load;
		});
	}, 100);
	const response = await fetch(apiURL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ query })
	});

	if (response.ok) {
		const responseObj = await response.json();
		const posts = responseObj.data.posts.nodes;
		loadingSomething.update((load) => {
			load = { state: false, count: 0 };
			return load;
		});
		clearInterval(interval);
		return {
			posts
		};
	}
	//todo: handle error with SvelteKit error page
	if (!response) throw error(404, 'Load posts failed.');
}
