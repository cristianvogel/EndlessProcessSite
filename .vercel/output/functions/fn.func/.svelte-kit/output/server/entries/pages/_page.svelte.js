import { c as create_ssr_component } from "../../chunks/index3.js";
import { A as Audio } from "../../chunks/Audio.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let parallel = [];
  Promise.all(data.buffers).then((buffers) => {
    for (let i = 0; i < buffers.length; i++) {
      const track = buffers[i];
      parallel.push(async () => {
        const decoded = await track.body;
        return Audio.updateVFS({ header: track.header, body: decoded });
      });
    }
    Promise.all(parallel.map((func) => func())).then((tracks) => {
      console.log("All ", tracks.length, " audio tracks decoded 🤖 ", buffers);
      if (!Audio.currentTrackName || Audio.currentTrackName === "") {
        Audio.currentTrackName = buffers[0].header.name;
      }
    });
  });
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return ``;
});
export {
  Page as default
};
