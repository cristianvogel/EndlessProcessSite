import { OutputMeters, PlaylistMusic } from "$lib/stores/stores";
import { AudioMain } from "$lib/classes/Audio";
import { hannEnvelope } from "$lib/audio/AudioFunctions";
import type { MessageEvent, MeterEvent, EventExpressionsForNamedRenderer } from "../../typeDeclarations";

const eventExpressions: EventExpressionsForNamedRenderer = new Map()

eventExpressions.set('music', {})
eventExpressions.set('speech', { meter: speechMeter })
eventExpressions.set('silent', { snapshot: playProgress })


function speechMeter(e: MeterEvent): void {
    OutputMeters.update(($o) => {
        const absMax = Math.max(e.max, Math.abs(e.min));
        $o = { ...$o, SpeechAudible: absMax };
        return $o;
    });
};

function playProgress(e: MessageEvent) {
    AudioMain.updateOutputLevelWith(hannEnvelope(AudioMain.progress));
    PlaylistMusic.update(($pl) => {
        if (!$pl.currentTrack || !e.data) return $pl;
        $pl.currentTrack.progress = e.data as number;
        return $pl;
    })
}

export default eventExpressions