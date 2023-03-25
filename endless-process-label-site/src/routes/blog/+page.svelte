<script lang="ts" >

  import type { PageData } from './$types';
  import {currentPostTitle, currentPostContent} from '$lib/stores/stores';
  const defaultFeaturedImage ='../src/lib/images/Default_Avatar.svg';
  export let data: PageData;
  

  // convert the string to camel case
  // remove any remaining white space
  function camelCaseNoWhiteSpace(str: string): string {
    let camelCaseStr = str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return word.toUpperCase();
    }).replace(/\s+/g, '');
  return camelCaseStr.replace(/\s+/g, '')};

// trim the content to 200 characters include the last '>' in the result
// then add a read more ellipsis link
function trimAndAddReadMoreLink(content: string, cutOffIndex: number = 200): string {
  const trimmedContent = content.substring(0, cutOffIndex);
  let lastTagIndex = trimmedContent.lastIndexOf('>'||'.') ;
  // skip possible  html tags at the start of the string
  lastTagIndex = lastTagIndex < 4 ? trimmedContent.length : lastTagIndex + 1;
  // todo: actually sanitize the html before returning
  const trimmedContentWithReadMore = trimmedContent.substring(0, lastTagIndex) + ' <a class=" !no-underline hover:!text-secondary-400 text-xs" href="/">…Read More</a>';
  return trimmedContentWithReadMore;
}

function handleCardEnter({e, cardIndex, title, content, featuredImageUrl}: {e: MouseEvent, cardIndex: string, title:string, content:HtmlContent, featuredImageUrl:Url}): void {
  const card = document.getElementById(cardIndex);
  if (card) {
    card.classList.add('brightness-125');
    currentPostTitle.set(title);
    currentPostContent.set(content);
  }
}

function handleCardLeave({e, cardIndex}: {e: MouseEvent, cardIndex: string}): void {
  const card = document.getElementById(cardIndex);
  if (card) {
    card.classList.remove('brightness-125');
    currentPostTitle.set('');
  }
}

</script>


<div class="p-2 ml-10 space-y-8">
<h1>Latest..</h1>
<ul class="columns-3 gap-10 space-y-2 text-2xl max-w-prose">

{#if data }
    {#each data.posts as {id, title, featuredImage, content},index}
   {@const cardIndex = 'card-000'+index}
   {@const featuredImageUrl = featuredImage ? featuredImage.node.sourceUrl : defaultFeaturedImage}
    <div 
      class='card break-inside-avoid-column p-0' 
      id={cardIndex} 
      on:mouseenter={(e)=>handleCardEnter( {e, cardIndex, title, content, featuredImageUrl} )}
      on:mouseleave={(e)=>handleCardLeave( {e, cardIndex} )}
      >
      <header >
        <span class="text-[0.4rem] pl-2 text-secondary-300">{cardIndex} </span>
        <img src={ featuredImageUrl  } 
        alt={featuredImage ? featuredImage.node.altText : 'featured image'}
        class="object-contain opacity-70 hover:opacity-100 rounded-lg p-1 w-full aspect-square "
        />
      </header>

          <section class='p-4 bg-surface-600 hover:bg-surface-400 hover:'>
            <a href="/latest/{camelCaseNoWhiteSpace(title ?? id)}">
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