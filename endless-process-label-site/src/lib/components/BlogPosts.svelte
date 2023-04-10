<script lang="ts" >

/**
 * Blog posts layout page
*/
  import { Icon } from '@steeze-ui/svelte-icon';
	import { CaretSortDown  } from '@steeze-ui/carbon-icons';
  import { singlePost } from '$lib/stores/stores';
  import { Utils } from '$lib/classes/Utils';
  const defaultFeaturedImage = '/Default_Avatar.svg';
  export let data: any;
   
  // the singPost store is set here and then used in the single post view
function handleCardEnter({e, cardIndex, title, content, featuredImageUrl, id, date}: {e: MouseEvent, cardIndex: string, title:string, content:string, featuredImageUrl:string, id:string, date:string}): void {
  const card = document.getElementById(cardIndex);
  if (card) {
    card.classList.add('brightness-125');
    singlePost.set({title, content: {rawHTML: content, sanitisedHTML: content} , featuredImageUrl, id, date, cardIndex});
  }
}

function handleCardLeave({e, cardIndex}: {e: MouseEvent, cardIndex: string}): void {
  const card = document.getElementById(cardIndex);
  if (card) {
    card.classList.remove('brightness-125');
    // singlePost.set({title: '', content:  { rawHTML: '', sanitisedHTML: '' }, featuredImageUrl: undefined, id: '', date: '', cardIndex: ''});
  }
}
</script>

<main>
<div class="p-2 space-y-8">
<!-- <h1 class='text-zinc'>Latest..</h1> -->
<Icon src={CaretSortDown} class="h-8 animate-pulse"/>
<ul class="md:container md:mx-auto columns-3 gap-10 space-y-8 text-2xl max-w-prose">
{#if data }
    {#each data.posts as {id, title, featuredImage, content, date},index}
   {@const cardIndex = Utils.repeatChar('═',index)+'・' + Utils.formatDate(date)}
   {@const routeSlug = Utils.camelCaseNoWhiteSpace(title ?? id)}
   {@const featuredImageUrl = featuredImage ? featuredImage.node.sourceUrl : defaultFeaturedImage}
    <div 
      class='card break-inside-avoid-column p-0' 
      id={cardIndex} 
      on:mouseenter={(e)=>handleCardEnter( {e, cardIndex, title, content, featuredImageUrl, id, date} )}
      on:mouseleave={(e)=>handleCardLeave( {e, cardIndex} )}
      >
      <header>
        <span class="text-[0.5rem] pl-2 text-tertiary-300">{cardIndex}</span>
        <a href="/latest/{routeSlug}">
        <img src={ featuredImageUrl  } 
        alt={featuredImage ? featuredImage.node.altText : 'featured image'}
        class="object-contain opacity-70 hover:opacity-100 rounded-lg p-1 w-full aspect-square "
        />
      </a>
      </header>

          <section class='p-4 bg-surface-600 hover:bg-surface-400 hover:'>
            <a href="/latest/{routeSlug}">
            <h1>
               { title ?? 'New Post'}
            </h1>
            </a>
         </section>
      
      <section class='card-footer p-2 w-full ' >
        <!-- todo: sanitise HTML for production -->
         {@html Utils.trimAndAddReadMoreLink( content ?? 'No content')}
      </section>
   </div>
       
    {/each}
    

   {:else}
   <p>Error loading data. Please try again.</p>
{/if}
</ul>
</div>
</main>