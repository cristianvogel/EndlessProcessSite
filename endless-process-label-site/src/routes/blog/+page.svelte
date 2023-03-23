<script lang="ts" >
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



</script>

<div class="p-2 ml-10 space-y-8">
<h1>Latest..</h1>
<ul class="columns-3 space-y-4 text-2xl max-w-prose">

{#if data }
    {#each data.posts as {id, title, featuredImage, content}}
   
    <div class='card break-inside-avoid-column'>
      <header >
        <img src={ featuredImage ? featuredImage.node.sourceUrl : defaultFeaturedImage  } 
        alt={featuredImage ? featuredImage.node.altText : 'featured image'}
        class="object-contain hover:opacity-50 rounded-lg p-1 w-full aspect-square "
        />
      </header>
          <section class='p-4 bg-surface-600 hover:bg-surface-400'>
            <a class='!no-underline' href="/latest/{camelCaseNoWhiteSpace(title ?? id)}">
            <h1>
               { title ?? 'New Post'}
            </h1>
            </a>
         </section>

      <section class='card-footer p-2 w-full '>
        {@html content}
      </section>
   </div>
       
    {/each}
    

   {:else}
   <p>No posts to display.</p>
{/if}
</ul>
</div>