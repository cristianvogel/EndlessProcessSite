let s="";const n=`
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
  `,a="https://endless-process.net/graphql",l=async({params:o})=>{s=o.slug;const e=await fetch(a,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:n,variables:{slug:s}})});try{if(!e.ok)throw new Error(`Could not load post. Status: ${e.status}`);const t=await e.json(),{post:r}=t.data;return{post:r,title:o.slug}}catch(t){return console.log("Error:",t),{error:t}}},i=Object.freeze(Object.defineProperty({__proto__:null,load:l},Symbol.toStringTag,{value:"Module"}));export{i as _,l};
