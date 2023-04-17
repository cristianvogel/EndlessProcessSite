import { w as writable, r as readable } from "./index2.js";
function getFiles() {
  let fileNames = [];
  try {
    const files = /* @__PURE__ */ Object.assign({ "../audio/mp3/01_Cutterhead-HeavenOrHell.mp3": () => import("./01_Cutterhead-HeavenOrHell.js"), "../audio/mp3/CitiesVersion_CristianVogel.mp3": () => import("./CitiesVersion_CristianVogel.js"), "../audio/mp3/sound.mp3": () => import("./sound.js") });
    const filePaths = Object.keys(files);
    fileNames = filePaths.map((filePath) => filePath.replace(`../audio/mp3/`, ""));
  } catch (error) {
    console.error(error);
  }
  return fileNames;
}
const singlePost = writable({
  title: "",
  content: { rawHTML: "", sanitisedHTML: "" },
  featuredImageURL: "",
  id: "",
  date: "",
  cardIndex: "",
  isOpen: false
});
const CablesPatch = writable("...loading...");
const CablesAudioContext = writable();
const CablesIsLoaded = writable(false);
const CablesText = writable(["Endless", "Process"]);
const Decoding = writable({
  done: false,
  progress: 0
});
const VFS_PATH_PREFIX = readable("/src/lib/audio/mp3/");
const PlaysCount = writable(0);
const Playlist = writable({
  playlist: getFiles(),
  durations: /* @__PURE__ */ new Map(),
  show: false,
  currentTrack: { name: "", path: "", loaded: false, progress: 0 }
});
const Scrubbing = writable(false);
const PlaylistVoice = writable({
  playlist: [],
  durations: /* @__PURE__ */ new Map(),
  currentChapter: { name: "", id: "chapter-1", path: "", progress: 0 }
});
export {
  CablesText as C,
  Decoding as D,
  Playlist as P,
  Scrubbing as S,
  VFS_PATH_PREFIX as V,
  PlaysCount as a,
  CablesIsLoaded as b,
  PlaylistVoice as c,
  CablesPatch as d,
  CablesAudioContext as e,
  singlePost as s
};
