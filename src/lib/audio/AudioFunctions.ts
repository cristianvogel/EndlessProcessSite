/**
 * 🔗 The Elementary Functional Audio Programming part of the app. 🔗
 * 
 * When we see a function returning the result of a further function call,
 * its because the functional implementation is wrapped in a 
 * memoized composite function, defined in the composites.ts file.
 * 
 * From here, we pass back a StereoSignal object, 
 * which is returned to the Elementary Core renderer in Audio.ts
 * 
 */

import { Audio, AudioCore } from '$lib/classes/Audio';
import { el } from '@elemaudio/core';
import { channelExtensionFor, clipTo0 } from '$lib/classes/Utils';
import { attenuate, progress, clippedHann } from '$lib/audio/El Funktions';
import type { StereoSignal, SamplerOptions, ProgressOptions, Signal } from '../../typeDeclarations';

/**════════════════════════════════════════════════
 * @name hannEnvelope
 * @description Quick and Dirty window function
 * @param index : number :: index into the window [0-1]
 * ════════════════════════════════════════════════
 */

export function hannEnvelope(index: number): Signal {
	return clippedHann({ gain: 30, index });
}

/**════════════════════════════════════════════════
 * @name attenuateStereo
 * @description Attenuate a stereo signal
 * @param signal : StereoSignal :: stereo signal to be attenuated
 * @param level : Signal | number :: mono signal to attenuate both channels
 * @param key : string :: optional key for the level signal
 * ════════════════════════════════════════════════
 */

export function attenuateStereo(signal: StereoSignal, level: Signal | number, key: string = 'level'): StereoSignal {
	return {
		left: attenuate({ key, level }, signal.left),
		right: attenuate({ key, level }, signal.right),
	}
}

/**════════════════════════════════════════════════
 * @name bufferProgress
 * @description Buffer progress as audio rate signal
 * ════════════════════════════════════════════════
 */

export function bufferProgress(props: ProgressOptions): Signal {
	return progress(props);
}

/**════════════════════════════════════════════════
 * @name meter
 * @description trigger metering callback on one channel
 * ════════════════════════════════════════════════
 */

export function meter(signal: StereoSignal, gain: number = 20): Signal {
	return el.meter(el.mul(gain, el.add(signal.left, signal.right)));
}

/**════════════════════════════════════════════════
 * @name scrubbingSamplesPlayer
 * @description Samples player with a granular scrubbing action
 * ════════════════════════════════════════════════
 */

export function scrubbingSamplesPlayer(props: SamplerOptions): StereoSignal {
	let { trigger = 1, rate = 1, startOffset = 0 } = props;
	let selectTriggerSignal = Audio.scrubbing ? 0 : 1;
	startOffset = clipTo0(startOffset);

	const scrubRate = el.sm(el.latch(el.train(50), el.rand()));
	const scrub: Signal = el.train(el.mul(50, scrubRate)) as Signal;

	const currentVFSPath = Audio.currentVFSPath;
	let path = currentVFSPath + channelExtensionFor(1);
	let kl = currentVFSPath + '_left';
	let kr = currentVFSPath + '_right';
	const left = el.sample(
		{
			key: kl,
			path,
			mode: 'gate',
			startOffset: startOffset * 44.1
		},
		el.select(selectTriggerSignal, el.const({ key: kl + 't', value: trigger as number }), scrub),
		rate
	);

	path = currentVFSPath + channelExtensionFor(2);
	const right = el.sample(
		{
			key: kr,
			path,
			mode: 'gate',
			startOffset: startOffset * 44.1
		},
		el.select(selectTriggerSignal, el.const({ key: kl + 't', value: trigger as number }), scrub),
		rate
	);
	return { left: left, right: right };
}

/**════════════════════════════════════════════════
 * @name driftingSamplesPlayer
 * @description 
 * Samples player where one channel (optionally) drifts in rate to create a tape phase effect
 * ════════════════════════════════════════════════
 */

export function driftingSamplesPlayer(coreClass: AudioCore, props: SamplerOptions): StereoSignal {
	let { trigger = 1,
		rate = 1,
		startOffset = 0,
		vfsPath = coreClass.currentVFSPath,
		monoSum = false,
		drift = 0 } = props;

	let kr, kl, path, rateWithDrift;
	let left, right;
	const currentVFSPath = vfsPath;

	if (typeof drift === 'number' && typeof rate === 'number') {
		rateWithDrift = drift + rate;
	}

	startOffset = clipTo0(startOffset);
	path = currentVFSPath + channelExtensionFor(1);
	kl = currentVFSPath + '_left';

	left = el.sample(
		{
			key: kl,
			path,
			mode: 'gate',
			startOffset: startOffset * 44.1
		},
		trigger,
		rate
	);

	path = currentVFSPath + channelExtensionFor(monoSum ? 1 : 2);
	kr = currentVFSPath + '_right';

	right = el.sample(
		{
			key: kr,
			path,
			mode: 'gate',
			startOffset: startOffset * 44.1
		},
		trigger,
		rateWithDrift as number
	);

	if (monoSum) { left = el.add(el.mul(0.5, left), el.mul(0.5, right)); right = left; }
	return { left: left as Signal, right: right as Signal };
}


/**════════════════════════════════════════════════
 * @name demoSynth
 * @description Demo synth with two dualSaws in stereo
 * uses detunedSaws interface
 * ════════════════════════════════════════════════
 */

export function demoSynth(): StereoSignal {
	return {
		left: detunedSaws(
			{
				ampMod: el.cycle(1 / 3)
			},
			el.const({ key: 'L1', value: 60 })
		),
		right: detunedSaws(
			{
				ampMod: el.cycle(0.5)
			},
			el.const({ key: 'R1', value: 62 })
		)
	};
}

/**════════════════════════════════════════════════
 * @name testTone
 * @description Stereo test tone
 * ════════════════════════════════════════════════
 */
export function testTone(): StereoSignal {
	return {
		left: el.cycle(460),
		right: el.cycle(463)
	};
}


