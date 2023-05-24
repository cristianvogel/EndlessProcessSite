import WebAudioRenderer from "@elemaudio/web-renderer";
import type { RendererStatus, NamedRenderers, Signal, StereoSignal } from "../../typeDeclarations";
import { el, resolve } from "@elemaudio/core";
import { attenuateStereo } from "$lib/audio/AudioFunctions";
import { SignalConstants, sumToMono } from "$lib/audio/Funktions";

export default class WebRendererExtended extends WebAudioRenderer {

    private _id: NamedRenderers;
    private _latestStereoRender: StereoSignal;
    private _masterVolume: number | Signal;
    private _rendererStatus: RendererStatus;

    constructor(id: NamedRenderers) {
        super();
        this._id = id;
        this._masterVolume = 0.808;
        this._rendererStatus = 'loading'
        this._latestStereoRender = { left: SignalConstants.ZERO, right: SignalConstants.ZERO };
    }

    /**
    * @name mainOut
    * @description Audible Master buss
    * Includes a stereo compressor, which is ducked by any signal routed to the sidechain   
    * initialisation option, arriving at el.in({channel:0})
    * @param stereoSignal optional stereo signal to render through the Master. 
    * If passed, it is stored in the AudioMain._out buss updating whatever was patched before.
    * @param attenuator optional attenuator signal which will smoothly scale the signal just
    * before final output, which is hard coded to be smooth scaled by the overall master volume. 
    * @param useExtSidechain optional boolean to use an external sidechain signal,
    * @param bypassCompressor optional boolean to bypass the compressor
    */
    mainOut(stereoSignal?: StereoSignal | undefined,
        options?: {
            attenuator?: Signal | number | undefined,
            compressor?: { useExtSidechain?: boolean, bypassCompressor?: boolean }
        }): void {

        if (this.id === 'data') { this.dataOut(sumToMono(stereoSignal as StereoSignal)) } 
        const { attenuator, compressor } = options || {};
        const { useExtSidechain = true, bypassCompressor = false } = compressor || {};;   

        if (stereoSignal) {
            this.latestStereoRender = stereoSignal;
        }
        const sc = useExtSidechain ? el.in({ channel: 0 }) : 0

        const dynamics = bypassCompressor ? this.latestStereoRender : {
            left: el.compress(20, 160, -35, 90, sc, this.latestStereoRender.left),
            right: el.compress(20, 160, -35, 90, sc, this.latestStereoRender.right)
        }

        let final = attenuator ? attenuateStereo(dynamics, attenuator) : dynamics;
        final = attenuateStereo(final, this.masterVolume)
        const result = this.render(final.left, final.right)
        //console.log('Updated mainOut for ', this.id, ' ፨ '); console.log(result);
    }

    dataOut(signal: Signal): void {

        const result = this.render(signal)
        console.group('Updated dataOut in ', this.id, ' ፨ '); console.log(result); console.groupEnd()
    }


    /// getters
    get id(): NamedRenderers { return this._id }
    get latestStereoRender(): StereoSignal { return this._latestStereoRender }
    get masterVolume(): number | Signal { return this._masterVolume }
    get status(): RendererStatus { return this._rendererStatus }

    // setters
    set latestStereoRender(stereoSignal: StereoSignal) { this._latestStereoRender = stereoSignal }
    set masterVolume(volume: number | Signal) { this._masterVolume = el.sm(volume) }
    set status(updatedStatus: RendererStatus) {
        this._rendererStatus = updatedStatus
        console.log('Renderer ', this.id, ' status updated to ', this._rendererStatus)
    }
}

