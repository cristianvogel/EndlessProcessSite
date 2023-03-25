import type { PageLoad } from './$types';
import { currentPostTitle } from '$lib/stores/stores';

let postTitle = '';

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

// subscribe to the store called currentTitle
currentPostTitle.subscribe(value => {value ? postTitle = value : postTitle = 'no title'});
  
export const load = (({ params, fetch }) => {

async function getPostByID() {

  const response = await fetch(import.meta.env.VITE_PUBLIC_WORDPRESS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: {
        slug: postTitle,
      }
    }),
  });

  if (response.ok) {
    const responseObj = await response.json();
    const { post } = responseObj.data;
    return {
        post 
    };
  }
  return {
    status: response.status,
    error: new Error(`Could not load post.`)
  };
}



  return {
    post: {
      post: getPostByID(),
      title: params.slug
    }
  };
}) satisfies PageLoad;