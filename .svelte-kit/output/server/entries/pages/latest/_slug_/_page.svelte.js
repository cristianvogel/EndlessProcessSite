import { c as create_ssr_component, l as subscribe, p as onDestroy, v as validate_component, e as escape, a as add_attribute, n as each } from "../../../../chunks/index3.js";
import { s as singlePost } from "../../../../chunks/stores.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { PageFirst, Close } from "@steeze-ui/carbon-icons";
import { W as Wait } from "../../../../chunks/Utils.js";
const SinglePost = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $singlePost, $$unsubscribe_singlePost;
  $$unsubscribe_singlePost = subscribe(singlePost, (value) => $singlePost = value);
  const { content, title, cardIndex, featuredImageUrl } = $singlePost;
  Wait.forNull(content.sanitisedHTML);
  function extractImages() {
    const images = [];
    const parser = new DOMParser();
    let doc = parser.parseFromString(content.sanitisedHTML, "text/html");
    const imgElements = doc.querySelectorAll("img");
    doc.querySelectorAll("img").forEach((img) => {
      img.remove();
    });
    imgElements.forEach((img) => {
      images.push(img.src);
    });
    return { prunedHTML: doc, imageURLs: images };
  }
  const { prunedHTML, imageURLs } = extractImages();
  onDestroy(() => {
    singlePost.update((post) => {
      post.isOpen = false;
      return post;
    });
  });
  $$unsubscribe_singlePost();
  return `<div class="flex justify-end -mb-20 mr-1"><span class="chip variant-soft hover:variant-ghost-secondary mr-3 p-0 z-50"><a href="/blog">${validate_component(Icon, "Icon").$$render(
    $$result,
    {
      src: PageFirst,
      class: "fill-tertiary-400 h-8 w-8 p-0 m-0"
    },
    {},
    {}
  )}</a></span>
	<span class="chip variant-soft hover:variant-ghost-secondary mr-3 p-0 z-50"><span>${validate_component(Icon, "Icon").$$render(
    $$result,
    {
      src: Close,
      class: "fill-tertiary-400 h-10 w-10 p-0 m-0"
    },
    {},
    {}
  )}</span></span></div>
<div class="m-0 p-6 bg-gradient-to-br from-surface-500 to-surface-800 opacity-95 m-3"><div class="bg-transparent p-3 text-tertiary-400 opacity-80"><h6 class="subheading">${escape(cardIndex)}</h6>
		<h1 class="">${escape(title)}</h1></div>
	<section class="grid grid-cols-3 p-1 divide-x-2 divide-tertiary-800 ">${prunedHTML ? `<div class="col-span-1 p-3 rounded-lg text-tertiary-400 text-left text-sm opacity-80"><ul>
					${featuredImageUrl ? `<img${add_attribute("src", featuredImageUrl, 0)} alt="featured artwork" class="w-35 h-22 p-3">` : ``}
		
					${each(imageURLs, (url) => {
    return `<img${add_attribute("src", url, 0)} alt="featured artwork" class="w-35 h-22 p-3">`;
  })}</ul></div>
			<article class="prose dark:prose-invert prose-img:rounded-xl break-inside-avoid-column prose-2xl leading-normal col-span-2 "><!-- HTML_TAG_START -->${prunedHTML.body.innerHTML}<!-- HTML_TAG_END --></article>` : ``}</section></div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(SinglePost, "SinglePost").$$render($$result, {}, {}, {})}`;
});
export {
  Page as default
};
