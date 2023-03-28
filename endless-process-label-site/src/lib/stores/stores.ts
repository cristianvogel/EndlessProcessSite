// CAV: This file is used to define the stores used in the app

import { writable, type Writable } from 'svelte/store';
import {el} from '@elemaudio/core';
import WebRenderer from '@elemaudio/web-renderer';


export const currentPost:Writable<CurrentPost> = writable({title: '', content: {rawHTML: '', sanitisedHTML:''}, featuredImageURL:'', id: '', date: '', cardIndex: ''});


/**
 *
 * Keeping the Renderer Class in a store, adding functionality
 * to it as and when needed.
 */

export const audioStatus: Writable<AudioStatus> = writable('closed');

class AudioEngine {
    
    core: WebRenderer | null
    ctx: AudioContext | null
    state: AudioStatus

    constructor() {
        this.core = null;
        this.ctx = null;
        this.state = 'closed';
    }

    async init(ctx?:AudioContext) : Promise<void> {
        this.core = new WebRenderer(); 
        if (ctx) { this.ctx = ctx } else { this.ctx = new AudioContext() }

         // Elementary load callback
        this.core.on('load', () => {
            console.log('Elementary loaded 🔊')  
        });
         // Elementary error reporting
         this.core.on('error', function(e) {
             console.error(e);
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
    
    resume() : void {
        this.ctx?.resume().then(() => {
            console.log('AudioContext resumed')
        })
     }

    public get isPlaying() : boolean {
        return this.state === 'playing' ? true : false;
    }

    public get isMuted() : boolean {
        return !this.isPlaying;
    }
    
    render(channels:any) : void {
        if (!this.core) return;
        this.state = 'playing';
        audioStatus.set(this.state);
        const leftBlockedOut = el.dcblock(channels.L)
        const rightBlockedOut = el.dcblock(channels.R)
        this.core.render(leftBlockedOut, rightBlockedOut)
    }

    testtone() : void {
        console.log('testtone')
        this.render( {L:el.cycle(440), R:el.cycle(441)} )
    }

    mute() : void {
        this.render( {L:el.sm(0), R:el.sm(0)} )
        this.state = 'muted';
        audioStatus.set(this.state);
    }

    close() : void {
        this.ctx?.close()
        this.state = 'closed';
        audioStatus.set(this.state);
    }

    reset() : void { 
        console.log('resetting Elementary')
        this.core?.reset() 
    }

}

export const _AudioEngine : Writable<AudioEngine> = writable( new AudioEngine() )