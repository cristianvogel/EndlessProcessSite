import type { AudioStatus } from 'src/typeDeclarations';
import { audioStatus } from '$lib/stores/stores';
import { el, type NodeRepr_t } from '@elemaudio/core';
import WebRenderer from '@elemaudio/web-renderer';
import { detunedSaws } from '$lib/audio/synths';

class AudioEngine {

    core: WebRenderer | null
    ctx: AudioContext | null
    state: AudioStatus
    leftOut: NodeRepr_t
    rightOut: NodeRepr_t
    masterVolume: number | NodeRepr_t;

    constructor() {
        const zeroDC: NodeRepr_t = el.const({ value: 0 })
        this.core = null;
        this.ctx = null;
        this.state = 'closed';
        this.leftOut = zeroDC
        this.rightOut = zeroDC
        this.masterVolume = 0.75
    }

    async init(ctx?: AudioContext): Promise<void> {
        this.core = new WebRenderer();
        if (ctx) { this.ctx = ctx } else { this.ctx = new AudioContext() }

        // Elementary load callback
        this.core.on('load', () => {
            console.log('Elementary loaded 🔊')
        });
        // Elementary error reporting
        this.core.on('error', function (e) {
            console.error(e);
        });

        this.core.on('fft', function (e) {
            // do something with the FFT data
            console.count('fft')
        });

        // Elementary connecting promise
        let node = await this.core.initialize(this.ctx, {
            numberOfInputs: 0,
            numberOfOutputs: 1,
            outputChannelCount: [2],
        });
        // now wire up the Elementary graph to the AudioContext
        node.connect(this.ctx.destination);
    }

    resume(): void {
        this.ctx?.resume().then(() => {
            console.log('AudioContext resumed');
        })
    }

    public get isPlaying(): boolean {
        return this.state === 'playing' ? true : false;
    }

    public get isMuted(): boolean {
        return !this.isPlaying;
    }
    /**
    * Just render a signal, no side effects
    */
    render(signal: NodeRepr_t): void {
        if (!this.core) return;
        this.core.render(signal)
    }

    /** 
    * Render DC Blocked signals as left and right output signals with following side effects; 
    * Set state to playing, store left and right output signals in this.leftOut and this.rightOut
    */
    renderChannels(channels: any): void {
        if (!this.core) return;
        this.leftOut = el.dcblock(channels.L)
        this.rightOut = el.dcblock(channels.R)
        this.core.render(this.leftOut, this.rightOut)
    }

    runFFT(): void {
        if (this.state === 'playing') {
            this.render(el.fft({ name: 'elFFT', key: 'fft' }, this.leftOut))
        }
    }

    testTone(): void {
        console.log('test tone')
        this.renderChannels({ L: el.cycle(460), R: el.cycle(463) })
    }

    demoSynth(): void {
        this.renderChannels({
            L: detunedSaws({ ampMod: el.cycle((1 / 3)) }, el.const({ key: 'L1', value: 60 })),
            R: detunedSaws({ ampMod: el.cycle(0.5) }, el.const({ key: 'R1', value: 90 }))
        });
    }

    mute(): void {
        this.renderChannels({ L: el.sm(0), R: el.sm(0) })
        this.state = 'muted';
        audioStatus.set(this.state);
        console.log('mute')
    }

    unmute(): void {
        this.state = 'playing';
        audioStatus.set(this.state);
        console.log('unmute')
        this.runFFT();
    }
}

export const audio: AudioEngine = new AudioEngine();