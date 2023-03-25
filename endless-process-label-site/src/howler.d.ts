// Type definitions for howler.js v2.0.1
// Project: https://github.com/goldfire/howler.js
// Definitions by: Mike Linkovich <https://github.com/spacejack>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare namespace Howler {

    interface HowlerGlobal {
        noAudio: boolean;
        usingWebAudio: boolean;
        mobileAutoEnable: boolean;
        autoSuspend: boolean;
        ctx?: AudioContext;
        masterGain?: GainNode;
        mute(muted: boolean): HowlerGlobal;
        volume(): number;
        volume(volume: number): HowlerGlobal;
        codecs(extension: string): boolean;
        unload(): void;
    }

    interface HowlerGlobalStatic {
        new(): HowlerGlobal;
    }

    interface Sprite {
        [name: string]: [number, number] | [number, number, boolean];
    }

    type HowlEvents = 'load' | 'loaderror' | 'play' | 'end' | 'pause' | 'stop' | 'mute' | 'volume' | 'rate' | 'seek' | 'fade'

    interface HowlProperties {
        autoplay?: boolean;
        src?: string[];
        format?: string[];
        loop?: boolean;
        sprite?: Sprite;
        volume?: number;
        rate?: number;
        onload?: () => void;
        onloaderror?: (id: number | null, error: any) => void;
        onpause?: (id: number) => void;
        onplay?: (id: number) => void;
        onstop?: (id: number) => void;
        onmute?: (id: number) => void;
        onvolume?: (id: number) => void;
        onrate?: (id: number) => void;
        onseek?: (id: number) => void;
        onfade?: (id: number) => void;
        onend?: (id: number) => void;
        html5?: boolean;
        preload?: boolean;
        mute?: boolean;
        pool?: number;
    }

    interface Howl {
        load(): Howl;
        play(): number;
        play(id: number): number;
        play(sprite: string): number;
        pause(soundId?: number): Howl;
        stop(soundId?: number): Howl;
        mute(muted?: boolean, soundId?: number): Howl;
        fade(from: number, to: number, duration: number, soundId?: number): Howl;
        rate(): number;
        rate(rate: number, id?: number): Howl;
        loop(): boolean;
        loop(loop: boolean, id?: number): Howl;
        seek(): number;
        seek(position: number, id?: number): Howl;
        state(): string;
        playing(id?: number): boolean;
        duration(id?: number): number;
        sprite(definition?: Sprite): Sprite;
        volume(): number;
        volume(volume: number, soundId?: number): Howl;
        on(event: HowlEvents, listener: (id: number) => void, id?: number): Howl;
        once(event: HowlEvents, listener: (id: number) => void, id?: number): Howl;
        off(event: HowlEvents, listener: (id: number) => void, id?: number): Howl;
        unload(): void;
    }

    interface HowlStatic {
        new (properties: HowlProperties): Howl;
    }

    interface Sound {
        init(): Sound;
        create(): Sound;
        reset(): Sound;
    }

    interface SoundStatic {
        new (howl: Howl): Sound;
    }
}

declare module "howler" {
    export let HowlerGlobal: Howler.HowlerGlobalStatic;
    export let Howler: Howler.HowlerGlobal;
    export let Howl: Howler.HowlStatic;
    export let Sound: Howler.SoundStatic;
}
