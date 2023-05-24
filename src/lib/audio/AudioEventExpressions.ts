import { ForceAudioContextResume, OutputMeters, PlaylistMusic } from "$lib/stores/stores";
import { AudioMain, resumeContext } from "$lib/classes/Audio";
import { hannEnvelope } from "$lib/audio/AudioFunctions";
import type { MessageEvent, MeterEvent, EventExpressionsForNamedRenderer, NamedRenderers } from "../../typeDeclarations";

/**
 * EventExpressions are functions that are called when an event is received 
 * from an Elementary audio renderer instance via the Event emitting interface of 
 * that instance.
 * At v2.0.0 a standard core fires 
 * el.meter, el.snapshot, el.fft, el.scope, load(), error()
 */

const eventExpressions: EventExpressionsForNamedRenderer = new Map()

const speech = {
    meter: (e: MeterEvent) => { updateSpeechVU(e) },
    error: (e: any) => { errorReporting(e, 'speech') },
    load: (e: any) => { loaded('speech') }
}

const data = {
    snapshot: (e: MessageEvent) => {
        console.log('snapshot', e)
        if (e.source === 'progress') {
            updateTrackPosition(e.data)
        }
    },
    error: (e: any) => { errorReporting(e, 'data') },
    load: (e: any) => { loaded('data') }
}

const music = {
    error: (e: any) => { errorReporting(e, 'music') },
    load: (e: any) => { loaded('music') }
}

function loaded(id: NamedRenderers) {
    ForceAudioContextResume.update(($f) => { $f = resumeContext; return $f });
    console.log(`${id} loaded 🔊`)
};

function errorReporting(e: unknown, id: NamedRenderers) {
    console.error(`🔇 Renderer Error from ${id}`);
    console.groupCollapsed('Error details');
    console.log(e)
    console.groupEnd();
};


function updateTrackPosition(data: any) {
    PlaylistMusic.update(($pl) => {
        const currentPosition = data as number;
        console.log(' position ', currentPosition)
        AudioMain.attenuateRendererWith('music', hannEnvelope(currentPosition as number));
        $pl.currentTrack.progress = currentPosition;
        return $pl
    })
}

function updateSpeechVU(data: any) {
    OutputMeters.update(($o) => {
        const absMax = Math.max(data.max, Math.abs(data.min));
        $o = { ...$o, SpeechAudible: absMax };
        return $o
    })
}

eventExpressions.set('music', music)
eventExpressions.set('speech', speech)
eventExpressions.set('data', data)


export default eventExpressions