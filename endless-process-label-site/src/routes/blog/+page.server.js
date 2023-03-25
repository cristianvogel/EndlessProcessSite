import { error } from '@sveltejs/kit';

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


export async function load({ fetch }) {

	const response = await fetch(import.meta.env.VITE_PUBLIC_WORDPRESS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({query}),
    });

    if (response.ok) {
        const responseObj = await response.json();
        const posts = responseObj.data.posts.nodes;

        return {     
                posts          
        }
    };


	if (!response) throw error(404);

}