/**
 * Elementary functional audio programming
 */
import { Audio } from '$lib/stores/AudioEngine';
import { el } from '@elemaudio/core';
import { channelExtensionFor } from '$lib/classes/Utils';
import { detunedSaws, attenuate } from '$lib/audio/composites';
import type { StereoSignal, SamplerOptions } from 'src/typeDeclarations';

/**
 * @description Samples player
 */

export function samplesPlayer(props: SamplerOptions): StereoSignal {
	let { vfsPath, trigger = 0, rate = 1 } = props;

	const left = el.sample(
		{
			key: vfsPath + channelExtensionFor(0) || 'samplesPlayer',
			channel: 0,
			path: vfsPath + channelExtensionFor(1)
		},
		trigger,
		rate
	);

	const right = el.sample(
		{
			key: vfsPath + channelExtensionFor(1) || 'samplesPlayer',
			channel: 0,
			path: vfsPath + channelExtensionFor(1)
		},
		trigger,
		rate
	);
	// todo: engineer linked stereo buffer playback
	return { left: left, right: right };
}

/**
 * @description Smooth mute
 */
export function smoothMute(): StereoSignal {
	return {
		left: el.sm(0),
		right: el.sm(0)
	};
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


