import { OutputMeters, PlaylistMusic } from "$lib/stores/stores";
import { AudioMain } from "$lib/classes/Audio";
import { hannEnvelope } from "$lib/audio/AudioFunctions";
import type { MessageEvent, MeterEvent, EventExpressionsForNamedRenderer } from "../../typeDeclarations";

/**
 * EventExpressions are functions that are called when an event is received 
 * from an Elementary audio renderer instance via the Event emitting interface of 
 * that instance.
 * At v2.0.0 a standard core fires 
 * el.meter, el.snapshot, el.fft, el.scope
 */

const eventExpressions: EventExpressionsForNamedRenderer = new Map()

const speech = {
    meter: (e: MeterEvent) => { updateSpeechVU(e) }
}

const data = {
    snapshot: (e: MessageEvent) => {
        if (e.source === 'progress') {  
            updateTrackPosition(e.data)
        } 
    }
}

eventExpressions.set('music', {})
eventExpressions.set('speech', speech)
eventExpressions.set('data', data)

export default eventExpressions

function updateTrackPosition(data: any) {
    PlaylistMusic.update(($pl) => {
        const previousPosition = $pl.currentTrack.progress;
        const currentPosition = data as number;
        AudioMain.attenuateRendererWith('music', hannEnvelope(previousPosition as number, $pl.currentTrack.title));
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