<script lang="ts" >
  	import { onMount } from 'svelte';
  import type { PageData } from './$types';

  const defaultFeaturedImage = '../src/lib/images/Default_Avatar.svg';
  const logo = '../src/lib/images/EP_logo.svg';
  export let data: PageData;
  
  const camelCaseNoWhiteSpace = (str: string): string => {
  // convert the string to camel case
  let camelCaseStr = str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');

  // remove any remaining white space
  return camelCaseStr.replace(/\s+/g, '');
  
};

// trim the content to 200 characters include the last '>' in the result
// then add a read more ellipsis link
function trimAndAddReadMoreLink(content: string, cutOffIndex: number = 200): string {
  const trimmedContent = content.substring(0, cutOffIndex);
  let lastTagIndex = trimmedContent.lastIndexOf('>'||'.') ;
  // skip possible  html tags at the start of the string
  lastTagIndex = lastTagIndex < 4 ? trimmedContent.length : lastTagIndex + 1;
  const trimmedContentWithReadMore = trimmedContent.substring(0, lastTagIndex) + ' <a class=" !no-underline hover:!text-secondary-400 text-xs" href="/">…Read More</a>';
  return trimmedContentWithReadMore;
}
</script>


<div class="p-2 ml-10 space-y-8">
<h1>Latest..</h1>
<ul class="columns-3 gap-10 space-y-4 text-2xl max-w-prose">

{#if data }
    {#each data.posts as {id, title, featuredImage, content}}
   
    <div class='card break-inside-avoid-column' id='aCard'>
      <header >
        <img src={ featuredImage ? featuredImage.node.sourceUrl : defaultFeaturedImage  } 
        alt={featuredImage ? featuredImage.node.altText : 'featured image'}
        class="object-contain opacity-70 hover:opacity-100 rounded-lg p-1 w-full aspect-square "
        />
      </header>

          <section class='p-4 bg-surface-600 hover:bg-surface-400 hover:'>
            <a class='!no-underline' href="/latest/{camelCaseNoWhiteSpace(title ?? id)}">
            <h1>
               { title ?? 'New Post'}
            </h1>
            </a>
         </section>
      
      <section class='card-footer p-2 w-full ' >
         {@html trimAndAddReadMoreLink( content ?? 'No content')}
      </section>
   </div>
       
    {/each}
    

   {:else}
   <p>No posts to display.</p>
{/if}
</ul>
</div>