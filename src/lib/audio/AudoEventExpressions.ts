import { OutputMeters, PlaylistMusic } from "$lib/stores/stores";
import { AudioMain } from "$lib/classes/Audio";
import { hannEnvelope } from "$lib/audio/AudioFunctions";
import type { AudioEventExpression, MessageEvent, MeterEvent } from "../../typeDeclarations";


export const eventExpressions: AudioEventExpression<any> =
{
    progress: (e: MessageEvent) => {
        AudioMain.updateOutputLevelWith(hannEnvelope(AudioMain.progress));
        PlaylistMusic.update(($pl) => {
            if (!$pl.currentTrack || !e.data) return $pl;
            $pl.currentTrack.progress = e.data as number;
            return $pl;
        })
    },
    meter: (e: MeterEvent) => {
        OutputMeters.update(($o) => {
            const absMax = Math.max(e.max, Math.abs(e.min));
            $o = { ...$o, SpeechAudible: absMax };
            return $o;
        })
    }
}


