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

import { Audio } from '$lib/classes/Audio';
import { el } from '@elemaudio/core';
import { channelExtensionFor, clipTo0 } from '$lib/classes/Utils';
import { detunedSaws, attenuate, progress } from '$lib/audio/composites';
import type { StereoSignal, SamplerOptions, ProgressOptions, Signal } from 'src/typeDeclarations';

/**
 * @description Buffer progress
 */

export function bufferProgress(props: ProgressOptions): Signal {
	return progress(props);
}

/**
 * @description Endless Process track player
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


/**
 * @description Stereo output
 */

export function stereoOut(stereoSignal: StereoSignal, key: string = ''): StereoSignal {
	return {
		left: attenuate(
			{
				level: Audio.masterVolume,
				key: key + '_master_L'
			},
			stereoSignal.left
		),
		right: attenuate(
			{
				level: Audio.masterVolume,
				key: key + '_master_R'
			},
			stereoSignal.right
		)
	};
}

/**
 * @description demo synth with two dualSaws in stereo
 * uses detunedSaws interface
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

/**
 * @description Stereo test tone
 */
export function testTone(): StereoSignal {
	return {
		left: el.cycle(460),
		right: el.cycle(463)
	};
}


