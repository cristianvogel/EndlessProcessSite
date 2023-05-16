import { OutputMeters, PlaylistMusic } from "$lib/stores/stores";
import type { CustomEventHandler, Signal } from "../../typeDeclarations";
import { AudioMain } from "$lib/classes/Audio";
import { hannEnvelope } from "$lib/audio/AudioFunctions";

type MeterEvent = { min: number, max: number };
type MessageEvent = { data: number | Signal };

// using snapshot event to update the progress of the windowing envelope
export const customEvents: CustomEventHandler = {
    ['progressSignal']: function (e: MessageEvent) {
        AudioMain.updateOutputLevelWith(hannEnvelope(AudioMain.progress));
        PlaylistMusic.update(($pl) => {
            if (!$pl.currentTrack || !e.data) return $pl;
            $pl.currentTrack.progress = e.data as number;
            return $pl;
        })
    },
    ['meter']: function (e: MeterEvent) {
        OutputMeters.update(($o) => {
            const absMax = Math.max(e.max, Math.abs(e.min));
            $o = { ...$o, SpeechAudible: absMax };
            return $o;
        })
    }
}