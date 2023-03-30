// Audio Out from Cables

const
    inAudio = op.inObject("Audio In", null, "audioNode"),
    inGain = op.inFloatSlider("Volume", 1),
    inMute = op.inBool("Mute", false),
    inShowSusp = op.inBool("Show Audio Suspended Button", true),
    outVol = op.outNumber("Current Volume", 1),
    outState = op.outString("Context State", "unknown");

op.setPortGroup("Volume Settings", [inMute, inGain]);

let isSuspended = false;
let audioCtx = CABLES.WEBAUDIO.createAudioContext(op);
let gainNode = new GainNode(audioCtx);
let gainNodeAsPlug = new GainNode(audioCtx);
const destinationNode = gainNodeAsPlug;
let oldAudioIn = null;
let connectedToOut = false;

inMute.onChange = () => {
    mute(inMute.get());
};

inGain.onChange = setVolume;
op.onMasterVolumeChanged = setVolume;

let pauseId = op.patch.on("pause", setVolume);
let resumeId = op.patch.on("resume", setVolume);

audioCtx.addEventListener("statechange", updateStateError);
inShowSusp.onChange = updateAudioStateButton;

updateStateError();
updateAudioStateButton();

op.onDelete = () => {
    if (gainNode) gainNode.disconnect();
    if (gainNodeAsPlug) gainNodeAsPlug.disconnect();
    gainNode = null;
    gainNodeAsPlug = null;
    CABLES.interActionNeededButton.remove("audiosuspended");
    if (pauseId) op.patch.off(pauseId);
    if (resumeId) op.patch.off(resumeId);
};

inAudio.onChange = function () {
    if (!inAudio.get()) {
        if (oldAudioIn) {
            try {
                if (oldAudioIn.disconnect) {
                    oldAudioIn.disconnect(gainNode);
                }
            }
            catch (e) {
                op.logError(e);
            }
        }

        op.setUiError("multipleInputs", null);

    }
    else {
        if (inAudio.links.length > 1) op.setUiError("multipleInputs", "You have connected multiple inputs. It is possible that you experience unexpected behaviour. Please use a Mixer op to connect multiple audio streams.", 1);
        else op.setUiError("multipleInputs", null);

        if (inAudio.get().connect) inAudio.get().connect(gainNode);
    }

    oldAudioIn = inAudio.get();

    if (!connectedToOut) {
        if (gainNode) gainNode.connect(destinationNode);
        connectedToOut = true;
    }

    setVolume();
};

function setVolume(fromMute) {
    const masterVolume = op.patch.config.masterVolume || 0;

    let volume = inGain.get() * masterVolume;

    if (op.patch._paused || inMute.get()) volume = 0;

    let addTime = 0.05;
    if (fromMute) addTime = 0.2;

    volume = CABLES.clamp(volume, 0, 1);

    if (!gainNode || !gainNodeAsPlug)
        op.logError("gainNode undefined");

    if (gainNode) gainNode.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + addTime);
    if (gainNodeAsPlug) gainNodeAsPlug.gain.linearRampToValueAtTime(1, audioCtx.currentTime + addTime);
    outVol.set(volume);
}

function mute(b) {
    // if (b) {
    //     if (audioCtx.state === "suspended") { // make sure that when audio context is suspended node will also be muted
    //         // this prevents the initial short sound burst being heard when context is suspended
    //         // and started from user interaction
    //         // also note, we have to cancle the already scheduled values as we have no influence over
    //         // the order in which onchange handlers are executed

    //         if (gainNode) {
    //             gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
    //             gainNode.gain.value = 0;
    //             gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    //         }

    //         outVol.set(0);

    //         return;
    //     }
    // }

    setVolume(true);
}

function updateStateError() {
    outState.set(audioCtx.state);
    op.logVerbose("audioCtx.state change", audioCtx.state);

    if (audioCtx.state == "suspended") op.setUiError("ctxSusp", "Your Browser suspended audio context, use playButton op to play audio after a user interaction");
    else op.setUiError("ctxSusp", null);

    updateAudioStateButton();
}

function updateAudioStateButton() {
    if (audioCtx.state == "suspended") {
        mute(true);
        if (inShowSusp.get()) {
            isSuspended = true;

            CABLES.interActionNeededButton.add(op.patch, "audiosuspended", () => {
                if (audioCtx && audioCtx.state == "suspended") {
                    audioCtx.resume();
                    CABLES.interActionNeededButton.remove("audiosuspended");
                }
            });
        }
        else {
            CABLES.interActionNeededButton.remove("audiosuspended");
        }
    }
    else {
        CABLES.interActionNeededButton.remove("audiosuspended");

        if (isSuspended) {
            op.log("was suspended - set vol");
            setVolume(true);
        }
    }
}