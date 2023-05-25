/**
 * ElementaryAudio 
 * NeverEngineLabs - El Funktion Library
 * author: @cristianvogel

 */

import { el, resolve, isNode } from '@elemaudio/core';
import type { Signal, StereoSignal } from '../../typeDeclarations';

/**
 * @name SignalConstants
 * @description Useful signal constants for normalised system
 */
export const SignalConstants = {
	ONE: el.const({ key: 'one', value: 1 }),
	MINUS_ONE: el.const({ key: 'minusOne', value: -1 }),
	ZERO: el.const({ key: 'zero', value: 0 }),
	HALF: el.const({ key: 'half', value: 0.5 }),
	MINUS_HALF: el.const({ key: 'minusHalf', value: -0.5 }),
	HALF_SR: el.mul(0.5, el.sr())
}

/** 
 * ╠══════════════════════════════════════════╣
 * @name stereoizeParam 
 * @description 
 * Cast a number to StereoSignal type
 * ╠══════════════════════════════════════════╣
 * @param value : number :: value to be casted
 * ╠══════════════════════════════════════════╣
*/
export function stereoizeParam(value: number): StereoSignal {
	const toSignal = el.const({ key: 'stereoize', value })
	return { left: toSignal, right: toSignal };
}

/** 
 * ╠══════════════════════════════════════════╣
 * @name stereoizeSignal
 * @description 
 * Cast a single Signal to StereoSignal type
 * ╠══════════════════════════════════════════╣
 * @param signal : Signal :: signal to be casted
 * ╠══════════════════════════════════════════╣
 */
export function stereoizeSignal(signal: Signal): StereoSignal {
	return { left: signal, right: signal };
}

/**
 * ╠══════════════════════════════════════════╣
 * @name numberToConstant
 * @description 
 * Cast a number to constant Signal
 * ╠══════════════════════════════════════════╣
 * @param key : string :: key for the node
 * @param value : number :: value for the node
 * ╠══════════════════════════════════════════╣
 */
export function numberToConstant(key: string, value: number): Signal {
	return el.const({ key, value: value });
}

/**
 * ╠═══
 * @name sumToMono
 * @description
 * Sum a StereoSignal to a Mono Signal
 * ╠═══
 */

export function sumToMono(signal: StereoSignal): Signal {
	return resolve(el.add(el.mul(0.5, signal.left), el.mul(0.5, signal.right)));
}

/**
 * ╠══════════════════════════════════════════╣
 * @name attenuate
 * @description 
 * Attenuate by another a level signal, 
 * with smoothing true by default
 * ╠══════════════════════════════════════════╣
 * @param props { level, key, bypassSmoothing }
 * @param level : Signal or number :: level to attenuate by
 * @param key : string :: optional key for the node
 * @param bypassSmoothing : boolean :: bypass default smoothing
 * @param input : Signal or number :: input signal to attenuate
 * ╠══════════════════════════════════════════╣
 */
export function attenuate(
	props: {
		level: Signal | number;
		key?: string;
		bypassSmoothing?: boolean
	},
	input: Signal
): Signal {
	let { key, level, bypassSmoothing = false } = props;
	level = isNode(level) ? level : resolve(el.const({ key: key + '_level', value: level as number }));
	level = bypassSmoothing ? level : el.sm(level);
	return resolve(el.mul(level, input));
}

/**
 * ╠══════════════════════════════════════════╣
 * @name progressCounter
 * @description 
 * Implements a parametised counter as an audio 
 * rate signal, with the side effect of emitting
 * a snapshot of normalised progress value 
 * emitted at a specified rate. This is an audio 
 * rate control signal, therefore it will also 
 * emit DC when rendered. One strategy is to render 
 * it with a secondary Elementary core, which is not 
 * connected to the audio output, and then use the snapshot 
 * to drive a UI progress bar or anything else code wise. 
 * The advantage of this approach is that the progress data 
 * can be further modified or debounced by signal processing.
 * ╠══════════════════════════════════════════╣
 * @param props { run, totalDurMs, rate, startOffset }
 * @param run [ signal or number ] :: run or pause the counter
 * @param totalDurMs [ number ] :: total duration of the counter in milliseconds
 * @param rate [ number ] :: snapshot rate in Hz
 * @param startOffset [ number ] :: start offset in milliseconds
 * ╠══════════════════════════════════════════╣
 */

export function progress(props: {
	key?: string;
	totalDurMs?: number;
	run: Signal | number;
	updateRate?: number;
	startOffset?: number;
}): Signal {
	let {
		run,
		totalDurMs = 0,
		updateRate: rate = 1000,
		startOffset = 0,
		key = 'progress'
	} = props; 
	const durationSec = 0.001 * totalDurMs
	const freqHz = 1 / durationSec
	run = isNode(run) ? run : resolve(el.const({ key: key + '_run', value: (run as number || startOffset) }));
	let pausingRateSignal = el.mul(run, el.const({ key: key + '_rate', value: freqHz }))
	const reset = pausingRateSignal
	let _progress = el.add(el.phasor(pausingRateSignal, reset), el.sm(numberToConstant(key, startOffset)));
	let trig = el.train(el.mul(rate, run))
	return (el.snapshot({ key, name: 'progress' }, trig, _progress));
}


/**
 * ╠══════════════════════════════════════════╣
 * @name clippedHann
 * @description A clipped hann window with optional pre-scaling
 * @param props { gain } :: optional gain before clipping
 * @param index [ signal or number ] :: phase index into the hann window lookup table
 * ╠══════════════════════════════════════════╣
 */
export function clippedHann(
	props: {
		key?: string;
		gain?: number | Signal;
		index: Signal | number,
	}
): Signal {
	let { key = 'clippedHann', gain = SignalConstants.ONE, index } = props;
	index = isNode(index) ? index : resolve(numberToConstant(key, index as unknown as number))
	return resolve(
		clipTo01(
			{ prescale: 1, fullRangeInput: false },
			el.mul(gain, el.hann(index)) as Signal
		))
}


/**
 * ╠══════════════════════════════════════════╣
 * @name clipTo01
 * @description Clip a signal to the range [0, 1] with optional pre-scaling
 * @param signal  optionally full range [-1,1] at input 
 * ╠══════════════════════════════════════════╣
 */
export function clipTo01(
	props: {
		prescale?: number | Signal,
		fullRangeInput?: boolean;
	},
	input: Signal): Signal {

	const { prescale = SignalConstants.ONE, fullRangeInput = false } = props;
	const positiveRange = fullRangeInput ? fullRangeTo01(input) as Signal : input;
	const final = el.mul(prescale, positiveRange) as Signal;
	return resolve(
		el.max(0, el.min(1, final))
	)
}

/**
 * ╠══════════════════════════════════════════╣
 * @name fullRangeTo01
 * @description Convert a full range signal to the range [0, 1]
 * @param signal expects full range [-1,1] signal
 * ╠══════════════════════════════════════════╣
 */
export function fullRangeTo01(input: Signal): Signal {
	return resolve(
		el.add(SignalConstants.HALF, el.mul(SignalConstants.HALF, input))
	)
}

