import{S as i,i as u,s as m}from"../chunks/index.e7457da3.js";import{A as t}from"../chunks/Audio.ae9829b3.js";function h(o,r,s){let{data:n}=r,l=[];return Promise.all(n.buffers).then(e=>{for(let a=0;a<e.length;a++){const d=e[a];l.push(async()=>{const c=await d.body;return t.updateVFS({header:d.header,body:c})})}Promise.all(l.map(a=>a())).then(a=>{console.log("All ",a.length," audio tracks decoded 🤖 ",e),(!t.currentTrackName||t.currentTrackName==="")&&(t.currentTrackName=e[0].header.name)})}),o.$$set=e=>{"data"in e&&s(0,n=e.data)},[n]}class f extends i{constructor(r){super(),u(this,r,h,null,m,{data:0})}}export{f as default};