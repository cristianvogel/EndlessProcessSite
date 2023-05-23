import WebAudioRenderer from "@elemaudio/web-renderer";
import type { NamedRenderers, Signal, StereoSignal } from "../../typeDeclarations";
import { el } from "@elemaudio/core";
import { attenuateStereo } from "$lib/audio/AudioFunctions";
import { SignalConstants } from "$lib/audio/Funktions";

export default class WebRendererExtended extends WebAudioRenderer {

    private _id: NamedRenderers;
    private _masterBuss: StereoSignal;
    private _masterVolume: number | Signal;


    constructor(id: NamedRenderers) {
        super();
        this._id = id;
        this._masterVolume = 0.808;
        this._masterBuss = { left: SignalConstants.ZERO, right: SignalConstants.ZERO };
    }

    /**
    * @name master
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
        const { attenuator, compressor } = options || {};
        const { useExtSidechain = false, bypassCompressor = true } = compressor || {};;

        if (stereoSignal) {
            this.masterBuss = stereoSignal;
        }
        const sc = useExtSidechain ? el.in({ channel: 0 }) : el.mul(0.5, this.masterBuss.left);

        const dynamics = bypassCompressor ? this.masterBuss : {
            left: el.compress(20, 160, -35, 90, sc, this.masterBuss.left),
            right: el.compress(20, 160, -35, 90, sc, this.masterBuss.right)
        }

        this.masterBuss = attenuator ? attenuateStereo(dynamics, attenuator) : dynamics;
        this.masterBuss = attenuateStereo(this.masterBuss, this.masterVolume)
        const result = this.render(this.masterBuss.left, this.masterBuss.right);
        console.groupCollapsed('Updated graph for ', this.id, ' ፨ ', result)
    }

    dataOut(signal: Signal): void {
        this.render(signal)
    }


    /// getters
    get id(): NamedRenderers { return this._id }
    get masterBuss(): StereoSignal { return this._masterBuss }
    get masterVolume(): number | Signal { return this._masterVolume }

    // setters
    set masterBuss(stereoSignal: StereoSignal) { this._masterBuss = stereoSignal }
    set masterVolume(volume: number | Signal) { this._masterVolume = el.sm(volume) }
}

