import { c as create_ssr_component, v as validate_component, n as each, a as add_attribute, e as escape } from "../../../chunks/index3.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { CaretSortDown } from "@steeze-ui/carbon-icons";
import "../../../chunks/stores.js";
import { U as Utils } from "../../../chunks/Utils.js";
import "../../../chunks/ProgressBar.svelte_svelte_type_style_lang.js";
const Apollo = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `
<svg id="svg-filter-apollo" class="hidden"><filter id="Apollo" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feColorMatrix values="0.8 0.6 -0.4 0.1 0,
					0 1.2 0.05 0 0,
					0 -1 3 0.02 0,
					0 0 0 50 0" result="final" in="SourceGraphic"></feColorMatrix></filter></svg>`;
});
const defaultFeaturedImage = "/Default_Avatar.svg";
const BlogPosts = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<main>${validate_component(Apollo, "Apollo").$$render($$result, {}, {}, {})}
<div class="p-2 space-y-8 ">${validate_component(Icon, "Icon").$$render(
    $$result,
    {
      src: CaretSortDown,
      class: "h-8 animate-pulse"
    },
    {},
    {}
  )}
<ul class="md:container md:mx-auto columns-2 gap-20 space-y-8 text-xl max-w-prose">${data ? `${each(data.posts, ({ id, title, featuredImage, content, date }, index) => {
    let cardIndex = Utils.repeatChar("═", index) + "・" + Utils.formatDate(date), routeSlug = Utils.camelCaseNoWhiteSpace(title ?? id), featuredImageUrl = featuredImage ? featuredImage.node.sourceUrl : defaultFeaturedImage, beforeStyle = `background-image: url(${featuredImageUrl}); 
          background-repeat: no-repeat; 
          background-position-y: 23%; 
          background-size: cover;
          opacity: 0.3`;
    return `
   
   
   
    <div class="card break-inside-avoid-column p-0"${add_attribute("id", cardIndex, 0)}><header><span class="text-[0.5rem] pl-2 text-secondary-300">${escape(cardIndex)}</span></header>
    <a href="${"/latest/" + escape(routeSlug, true)}"><section class="p-4 bg-black hover:bg-zinc-800 hover:text-black relative">
        <h1 class="text-secondary-400">${escape(title ?? "New Post")}</h1>
    
      <div class="absolute inset-0 z-0 before:content before:absolute before:inset-0"${add_attribute("style", beforeStyle, 0)}></div>
      
    </section></a>
    <section class="card-footer p-2 w-full text-tertiary-600">
      <!-- HTML_TAG_START -->${Utils.trimAndAddReadMoreLink(content ?? "No content")}<!-- HTML_TAG_END --></section>
    </div>`;
  })}` : `<p>Error loading data. Please try again.</p>`}</ul></div></main>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(BlogPosts, "BlogPosts").$$render($$result, { data }, {}, {})}`;
});
export {
  Page as default
};
