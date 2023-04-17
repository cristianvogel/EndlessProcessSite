import { w as writable, d as derived } from "./index2.js";
import { c as channelExtensionFor, a as clipTo0, b as clipToRange } from "./Utils.js";
import { P as Playlist, V as VFS_PATH_PREFIX, S as Scrubbing, d as CablesPatch, D as Decoding } from "./stores.js";
import WebRenderer from "@elemaudio/web-renderer";
import { createNode, resolve, el } from "@elemaudio/core";
import { o as get_store_value } from "./index3.js";
function _attenuate({ props, children }) {
  const key = props.key ? props.key : "attenuator";
  return resolve(el.mul({ key }, el.sm(props.level), children[0]));
}
function attenuate(props, signal) {
  return createNode(_attenuate, props, [signal]);
}
function _progress({ props, children }) {
  let { run, totalDurMs, rate = 10, startOffset = 0 } = props;
  const key = props.key ? props.key + "_ss" : "progress";
  let progress2 = el.add(
    el.counter({ key: key + "_count" }, el.const({ key: key + "_run", value: run })),
    el.ms2samps(startOffset)
  );
  let normProgress = el.div({ key: key + "_div" }, progress2, el.ms2samps(totalDurMs));
  return resolve(
    el.snapshot({ key, name: "progress" }, el.train(rate ? rate * run : run), normProgress)
  );
}
function progress(props) {
  return createNode(_progress, props, []);
}
function bufferProgress(props) {
  return progress(props);
}
function scrubbingSamplesPlayer(props) {
  let { trigger = 1, rate = 1, startOffset = 0 } = props;
  let selectTriggerSignal = Audio.scrubbing ? 0 : 1;
  startOffset = clipTo0(startOffset);
  const scrubRate = el.sm(el.latch(el.train(50), el.rand()));
  const scrub = el.train(el.mul(50, scrubRate));
  const currentVFSPath = Audio.currentVFSPath;
  let path = currentVFSPath + channelExtensionFor(1);
  let kl = currentVFSPath + "_left";
  let kr = currentVFSPath + "_right";
  const left = el.sample(
    {
      key: kl,
      path,
      mode: "gate",
      startOffset: startOffset * 44.1
    },
    el.select(selectTriggerSignal, el.const({ key: kl + "t", value: trigger }), scrub),
    rate
  );
  path = currentVFSPath + channelExtensionFor(2);
  const right = el.sample(
    {
      key: kr,
      path,
      mode: "gate",
      startOffset: startOffset * 44.1
    },
    el.select(selectTriggerSignal, el.const({ key: kl + "t", value: trigger }), scrub),
    rate
  );
  return { left, right };
}
function stereoOut(stereoSignal, key = "") {
  return {
    left: attenuate(
      {
        level: Audio.masterVolume,
        key: key + "_master_L"
      },
      stereoSignal.left
    ),
    right: attenuate(
      {
        level: Audio.masterVolume,
        key: key + "_master_R"
      },
      stereoSignal.right
    )
  };
}
class AudioCore {
  #core;
  #silentCore;
  _AudioCoreStatus;
  _contextIsRunning;
  _elemLoaded;
  _audioContext;
  _endNodes;
  _masterVolume;
  _currentTrackName;
  _currentVFSPath;
  _currentTrackDurationSeconds;
  _scrubbing;
  constructor() {
    this.#core = this.#silentCore = null;
    this._masterVolume = writable(1);
    this._AudioCoreStatus = writable("loading");
    this._contextIsRunning = writable(false);
    this._elemLoaded = writable(false);
    this._audioContext = writable();
    this._endNodes = writable({
      mainCore: null,
      silentCore: null
    });
    this._currentVFSPath = "";
    this._currentTrackName = "";
    this._currentTrackDurationSeconds = 0;
    this._scrubbing = false;
  }
  subscribeToStores() {
    Playlist.subscribe(($Playlist) => Audio._currentTrackName = $Playlist.currentTrack.name);
    Playlist.subscribe(
      ($Playlist) => Audio._currentVFSPath = get_store_value(VFS_PATH_PREFIX) + $Playlist.currentTrack.name
    );
    Playlist.subscribe(
      ($Playlist) => Audio._currentTrackDurationSeconds = $Playlist.currentTrack.duration ? $Playlist.currentTrack.duration : 0
    );
    Scrubbing.subscribe(($Scrubbing) => {
      Audio._scrubbing = $Scrubbing;
    });
  }
  cleanup() {
  }
  /**
   * @description Initialise the Elementary audio engine asynchronously
   * and store it in the Audio class as Audio.elemEndNode
   */
  async init(ctx) {
    Audio.#core = new WebRenderer();
    Audio.#silentCore = new WebRenderer();
    Audio.subscribeToStores();
    if (ctx) {
      Audio.actx = ctx;
      console.log("Passing existing AudioContext");
    } else {
      console.log("No context!");
    }
    Audio.elemEndNode = await Audio.#core.initialize(Audio.actx, {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [2]
    }).then((node) => {
      Audio.resumeContext();
      Audio._elemLoaded.set(true);
      return node;
    });
    Audio.elemSilentNode = await Audio.#silentCore.initialize(Audio.actx, {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      outputChannelCount: [2]
    }).then((node) => {
      return node;
    });
    Audio.routeToCables();
    Audio.connectToDestination(Audio.elemEndNode);
    Audio.actx.addEventListener("statechange", Audio.stateChangeHandler);
    Audio.#core.on("load", () => {
      console.log("Main core loaded 🔊?", Audio.elemLoaded);
      Audio.currentVFSPath += `${Audio._currentTrackName}`;
    });
    Audio.#silentCore.on("load", () => {
      console.log("Silent core loaded");
    });
    Audio.#core.on("error", function(e) {
      console.error("🔇 ", e);
    });
    Audio.#silentCore.on("error", function(e) {
      console.error("🔇 ", e);
    });
    Audio.#core.on("fft", function(e) {
      console.count("fft");
    });
    Audio.#core.on("meter", function(e) {
      console.count("meter");
    });
    Audio.#silentCore.on("snapshot", function(e) {
      Playlist.update(($pl) => {
        $pl.currentTrack.progress = clipToRange(e.data, 0, 1);
        return $pl;
      });
    });
  }
  /*---- Callback handlers ------------------------------*/
  stateChangeHandler = () => {
    Audio._contextIsRunning.update(() => {
      return Audio.actx.state === "running";
    });
    Audio._AudioCoreStatus.update(() => {
      return Audio.baseState;
    });
  };
  /*---- Implementations  ------------------------------*/
  /**
   * @description Connect a node to the BaseAudioContext destination
   */
  connectToDestination(node) {
    node.connect(Audio.actx.destination);
  }
  /**
   *  @description Routing the Elementary graph into the Cables.gl visualiser
   */
  routeToCables() {
    const cablesSend = new GainNode(Audio.actx, { gain: 10 });
    Audio.elemEndNode.connect(cablesSend);
    get_store_value(CablesPatch).getVar("CablesAnalyzerNodeInput").setValue(cablesSend);
  }
  /**
   * @description Elementary Audio WebRenderer uses a virtual file system to reference audio files.
   * https://www.elementary.audio/docs/packages/web-renderer#virtual-file-system
   * Update the virtual file system using data loaded from the +page.ts load() function
  	todo: better typing for vfsDictionaryEntry
   */
  async updateVFS(rawAudioBuffer) {
    let vfsDictionaryEntry;
    this.decodeRawBuffer(rawAudioBuffer).then(([decoded, vfsPath]) => {
      if (!decoded) {
        console.warn("Decoding skipped.");
        return;
      }
      for (let i = 0; i < decoded.numberOfChannels; i++) {
        vfsDictionaryEntry = {
          ...vfsDictionaryEntry,
          [`${vfsPath}${channelExtensionFor(i + 1)}`]: decoded.getChannelData(i)
        };
      }
      Audio.#core?.updateVirtualFileSystem(vfsDictionaryEntry);
    });
  }
  /**
   * @description Decodes the raw audio buffer into an AudioBuffer, asynchonously with guards
   */
  async decodeRawBuffer(rawAudioBuffer) {
    const stopwatch = Date.now();
    while (!rawAudioBuffer)
      await new Promise((resolve2) => setTimeout(resolve2, 100));
    const { body, header } = rawAudioBuffer;
    let decoded = null;
    while (!Audio.actx || !body) {
      await new Promise((resolve2) => setTimeout(resolve2, 100));
    }
    try {
      decoded = await Audio.actx.decodeAudioData(body);
    } catch (error) {
      console.log(new Error("Decoding skipped. Dummy buffer created."));
      decoded = Audio.actx?.createBuffer(1, 1, 44100);
    } finally {
      const { vfsPath } = header;
      const bytes = decoded?.getChannelData(0).length;
      header.bytes = bytes || 0;
      console.log(
        "Decoded audio with length ",
        bytes,
        " to ",
        vfsPath,
        " in ",
        Date.now() - stopwatch,
        "ms"
      );
      Decoding.update(($d) => {
        $d.done = true;
        return $d;
      });
    }
    if (decoded && decoded.duration > 1) {
      Playlist.update(($plist) => {
        if (!decoded)
          return $plist;
        $plist.durations.set(header.name, decoded.duration);
        return $plist;
      });
    }
    return [decoded, header.vfsPath];
  }
  /**
   * @description Wraps the Elementary core Render function
   */
  render(stereoSignal) {
    if (!Audio.#core || !stereoSignal)
      return;
    Audio.status = "playing";
    const final = stereoOut(stereoSignal);
    Audio.#core.render(final.left, final.right);
  }
  /**
   * @description silent render of a control signal, for handling a signal with a side effect like the progress counter composite, which emits an event _and_ an audiorate signal
   */
  controlRender(controlSignal) {
    if (!Audio.#silentCore || !controlSignal)
      return;
    Audio.#silentCore.render(el.mul(controlSignal, 0));
  }
  /**
   * @description: Plays samples from a VFS path, with scrubbing
   */
  playWithScrubFromVFS(props) {
    Audio.render(scrubbingSamplesPlayer(props));
    Audio.progressBar({
      run: props.trigger,
      startOffset: props.startOffset || 0
    });
  }
  /**
   * @description: Render the progress counter composite and its callback sideeffect
   */
  progressBar(props) {
    let { run = 1, startOffset: startOffsetMs = 0 } = props;
    let rate = 10;
    const totalDurMs = Audio.currentTrackDurationSeconds * 1e3;
    Audio.controlRender(
      bufferProgress({
        key: Audio.currentTrackDurationSeconds + "_progBar",
        totalDurMs,
        run,
        rate,
        startOffset: startOffsetMs
      })
    );
  }
  /**
   * @description: Tries to resume the base AudioContext
   */
  resumeContext() {
    if (!Audio.actx)
      return;
    Audio.actx.resume().then(() => {
      console.log("AudioContext resume ⚙︎");
    });
  }
  /**
   * Unmute aka 'Play'
   */
  unmute() {
    if (Audio.status === "suspended") {
      Audio.resumeContext();
    }
    Audio.playWithScrubFromVFS({
      vfsPath: Audio.currentVFSPath,
      trigger: 1
    });
  }
  /**
   * @description
   * Stop sounding but keep the audio context running
   * , send a Mute message to Cables patch
   */
  pause(pauseCables = false) {
    Audio.playWithScrubFromVFS({
      vfsPath: Audio.currentVFSPath,
      trigger: 0
    });
    Audio.status = "paused";
    if (pauseCables)
      Audio.pauseCables("pause");
  }
  // todo: pause or resume Cables patch
  pauseCables(state) {
  }
  suspend() {
    Audio.actx.suspend().then(() => {
      console.log("🔇 audiocontext suspended");
    });
  }
  suspendAfterMs(ms = 100) {
    new Promise((res) => setTimeout(res, ms)).then(() => {
      Audio.suspend();
    });
  }
  /*---- getters  --------------------------------*/
  get stores() {
    return {
      audioStatus: Audio._AudioCoreStatus,
      isRunning: Audio._contextIsRunning,
      actx: Audio._audioContext,
      endNodes: Audio._endNodes,
      masterVolume: Audio._masterVolume
    };
  }
  get scrubbing() {
    return Audio._scrubbing;
  }
  get currentTrackDurationSeconds() {
    return Audio._currentTrackDurationSeconds;
  }
  get currentVFSPath() {
    return Audio._currentVFSPath;
  }
  get audioBuffersReady() {
    return typeof Audio._currentTrackName === "string";
  }
  get currentTrackName() {
    return Audio._currentTrackName;
  }
  get masterVolume() {
    return get_store_value(Audio._masterVolume);
  }
  get contextAndStatus() {
    return derived([Audio._audioContext, Audio._AudioCoreStatus], ([$audioContext, $status]) => {
      return { context: $audioContext, status: $status };
    });
  }
  get actx() {
    return get_store_value(Audio.contextAndStatus).context;
  }
  get status() {
    console.log("get status", get_store_value(Audio._AudioCoreStatus));
    return get_store_value(Audio._AudioCoreStatus);
  }
  get elemLoaded() {
    return get_store_value(Audio._elemLoaded);
  }
  get isRunning() {
    return get_store_value(Audio._contextIsRunning);
  }
  get isMuted() {
    return Audio.status !== "playing" || !Audio.isRunning;
  }
  get elemSilentNode() {
    return get_store_value(Audio._endNodes).silentCore;
  }
  get elemEndNode() {
    return get_store_value(Audio._endNodes).mainCore;
  }
  get baseState() {
    return Audio.actx.state;
  }
  /*---- setters --------------------------------*/
  set currentVFSPath(path) {
    Playlist.update(($plist) => {
      $plist.currentTrack.path = path;
      return $plist;
    });
  }
  set currentTrackName(name) {
    Playlist.update(($plist) => {
      $plist.currentTrack.name = name;
      return $plist;
    });
  }
  set masterVolume(normLevel) {
    Audio._masterVolume.update(() => normLevel);
  }
  set actx(newCtx) {
    Audio._audioContext.update(() => newCtx);
  }
  set status(newStatus) {
    Audio._AudioCoreStatus.update(() => newStatus);
  }
  set elemSilentNode(node) {
    Audio._endNodes.update((n) => {
      n.silentCore = node;
      return n;
    });
  }
  set elemEndNode(node) {
    Audio._endNodes.update((n) => {
      n.mainCore = node;
      return n;
    });
  }
}
const Audio = new AudioCore();
export {
  Audio as A,
  AudioCore as a,
  stereoOut as s
};
