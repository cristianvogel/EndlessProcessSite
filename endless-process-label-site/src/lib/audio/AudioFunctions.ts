/**
 * Elementary functional audio programming
 */
import { get } from 'svelte/store';
import { Audio } from '$lib/stores/AudioEngine';
import { el } from '@elemaudio/core';
import { detunedSaws, cleanStereoOut } from '$lib/audio/composites';
import type { StereoSignal, Signal, SamplerOptions } from 'src/typeDeclarations';

/**
 * @description Samples player
 */

export function samplesPlayer(props: SamplerOptions): StereoSignal {
	let { vfsPath, trigger = 1, rate = 1 } = props;

	const monoSample = el.sample(
		{
			channel: 0,

			path: vfsPath
		},
		trigger,
		rate
	);

	return { left: monoSample, right: monoSample };
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
 * @description Stereo out, no DC offset
 */

interface cleanStereoOut {
	props: { level: Signal | number };
	stereoSignal: StereoSignal;
}

export function stereoOut(stereoSignal: StereoSignal): StereoSignal {
	const level = get(Audio.stores.masterVolume);
	console.log('level', level);
	return cleanStereoOut(
		{
			level: el.sm(level)
		},
		stereoSignal
	);
}

/**
 * @description demo synth with two detuned saws
 */

interface detunedSaws {
	props: { ampMod: number };
	frequency: Signal | number;
}

export function demoSynth(): StereoSignal {
	return {
		left: detunedSaws({ ampMod: el.cycle(1 / 3) }, el.const({ key: 'L1', value: 60 })),
		right: detunedSaws({ ampMod: el.cycle(0.5) }, el.const({ key: 'R1', value: 90 }))
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

// /**
//  * @description Render a stereo signal
//  */
// export function renderStereo(stereoSignal: StereoSignal): void {
// 	const cablesAudioContext = CABLES.WEBAUDIO.getAudioContext();
// 	// this check is maybe not required.
// 	if (cablesAudioContext !== null && cablesAudioContext !== Audio.actx) {
// 		Audio.actx = CABLES.WEBAUDIO._audioContext;
// 	}
// 	// check if the Audio.status is muted
// 	if (Audio.isMuted) {
// 		return;
// 	}

// 	// render with a method call to the AudioEngine
// }
