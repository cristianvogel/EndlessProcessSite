import { P as Playlist } from "../../chunks/stores.js";
import { e as error } from "../../chunks/index.js";
const sourceURL_prefix = "/audio/mp3/";
let playlist;
const unsubscribe = Playlist.subscribe((container) => {
  playlist = container.playlist;
});
const target = (entry, i) => `${sourceURL_prefix}${entry}`;
async function load({ fetch }) {
  let responses = [];
  let rawAudioBuffers = [];
  for (let i = 0; i < playlist.length; i++) {
    const entry = playlist[i];
    const loadFrom = target(entry);
    console.log("Fetching ", loadFrom);
    const stopwatch = Date.now();
    responses.push(await fetch(loadFrom));
    console.log(" in ", Date.now() - stopwatch, "ms");
  }
  for (let i = 0; i < responses.length; i++) {
    const response = responses[i];
    const rawArrayBuffer = async () => {
      return await response.arrayBuffer();
    };
    if (response.ok) {
      const structuredAudioBuffer = {
        header: {
          name: playlist[i],
          bytes: 0,
          vfsPath: sourceURL_prefix + playlist[i]
        },
        body: rawArrayBuffer()
      };
      const wrap = async () => {
        return structuredAudioBuffer;
      };
      rawAudioBuffers.push(wrap());
    } else {
      console.log("ArrayBuffer fetch failed 😿");
      throw error(404);
    }
  }
  unsubscribe();
  return { buffers: rawAudioBuffers };
}
export {
  load
};
