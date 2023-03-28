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

    constructor() {
        const zeroDC: NodeRepr_t = el.const({ value: 0 })
        this.core = null;
        this.ctx = null;
        this.state = 'closed';
        this.leftOut = zeroDC
        this.rightOut = zeroDC
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
            console.log('AudioContext resumed')
        })
    }

    public get isPlaying(): boolean {
        return this.state === 'playing' ? true : false;
    }

    public get isMuted(): boolean {
        return !this.isPlaying;
    }
    /** 
    * Render DC Blocked signals as left and right output signals with following side effects; 
    * Set state to playing, store left and right output signals in this.leftOut and this.rightOut
    */
    renderChannels(channels: any): void {
        if (!this.core) return;
        if (this.state === 'playing') {
            this.leftOut = el.dcblock(channels.L)
            this.rightOut = el.dcblock(channels.R)
            this.core.render(this.leftOut, this.rightOut)
            this.runFFT()
        } else {
            return
        }
    }
    /**
     * Just render a signal, no side effects
     */
    render(signal: NodeRepr_t): void {
        if (!this.core) return;
        this.core.render(signal)
    }

    runFFT(): void {
        if (this.state === 'playing') {
            this.render(el.fft({ name: 'elFFT' }, this.leftOut))
        }
    }

    testTone(): void {
        console.log('test tone')
        this.renderChannels({ L: el.cycle(440), R: el.cycle(441) })
    }

    demoSynth(): void {
        this.renderChannels({
            L: detunedSaws({ ampMod: el.cycle(1.0) }, el.const({ key: 'L1', value: 60 })),
            R: detunedSaws({ ampMod: el.cycle(0.5) }, el.const({ key: 'R1', value: 60.618 }))
        });
    }

    mute(): void {
        this.renderChannels({ L: el.sm(0), R: el.sm(0) })
        this.state = 'muted';
        audioStatus.set(this.state);
    }

    unmute(): void {
        // this.renderChannels({ L: this.leftOut, R: this.rightOut })
        this.state = 'playing';
        audioStatus.set(this.state);
    }

    reset(): void {
        console.log('resetting Elementary')
        this.core?.reset()
    }
}

export const audio: AudioEngine = new AudioEngine();