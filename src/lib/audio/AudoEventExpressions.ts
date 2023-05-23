import { OutputMeters, PlaylistMusic } from "$lib/stores/stores";
import { AudioMain } from "$lib/classes/Audio";
import { hannEnvelope } from "$lib/audio/AudioFunctions";
import type { MessageEvent, MeterEvent, EventExpressionsForNamedRenderer, ExtendedWebRenderer } from "../../typeDeclarations";

/**
 * EventExpressoions are functions that are called when an event is received 
 * from an Elementary audio renderer instance via the Event emitting interface of 
 * that instance.
 * At v2.0.0 a standard core fires 
 * el.meter, el.snapshot, el.fft, el.scope
 */

const eventExpressions: EventExpressionsForNamedRenderer = new Map()

const speech = {
    meter: (e: MeterEvent) => {
        OutputMeters.update(($o) => {
            const absMax = Math.max(e.max, Math.abs(e.min));
            $o = { ...$o, SpeechAudible: absMax };
            return $o
        })
    },
}

const data = {
    snapshot: (e: MessageEvent) => {
        if (e.source === 'progress') {  
            updateTrackPosition(e.data)
        } else console.log('control renderer received snapshot from source: ', e.source, e.data);
    }
}

eventExpressions.set('music', {})
eventExpressions.set('speech', speech)
eventExpressions.set('data', data)

export default eventExpressions

function updateTrackPosition(data: any) {
    PlaylistMusic.update(($pl) => {
        const prevPosition = $pl.currentTrack.progress
        const currentPosition = data as number;
        AudioMain.attenuateRendererWith('music', hannEnvelope(prevPosition as number));
        $pl.currentTrack.progress = currentPosition;
        return $pl
    })
}