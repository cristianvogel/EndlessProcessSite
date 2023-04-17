/**
 * ElementaryAudio 🍄 CompositeNodes
 * https://www.elementary.audio/docs/guides/Understanding_Memoization#composite-nodes
 */

import { createNode, el, resolve } from '@elemaudio/core';

import type { Signal } from 'src/typeDeclarations';

//--- detunedSaws --------------------------------------------------------

function _dualSaw({ props, children }): Signal {
	return resolve(
		el.mul(
			props.ampMod,
			0.5,
			el.add(el.blepsaw(children[0]), el.blepsaw(el.mul(1.01, children[0])))
		)
	);
}

export function detunedSaws(
	props: { ampMod: Signal | number },
	frequency: Signal | number
): Signal {
	return createNode(_dualSaw, props, [frequency]);
}

//--- attenuate --------------------------------------------------------

function _attenuate({ props, children }): Signal {
	const key = props.key ? props.key : 'attenuator';
	return resolve(el.mul({ key: key }, el.sm(props.level), children[0]));
}

export function attenuate(
	props: {
		level: Signal | number;
		key?: string;
	},
	signal: Signal
): Signal {
	return createNode(_attenuate, props, [signal]);
}

//--- progress --------------------------------------------------------

function _progress({ props, children }): Signal {
	// el.snapshot emits events received by Elementary SilentCore
	let { run, totalDurMs, rate = 10, startOffset = 0 } = props;
	const key = props.key ? props.key + '_ss' : 'progress';
	let progress = el.add(
		el.counter({ key: key + '_count' }, el.const({ key: key + '_run', value: run })),
		el.ms2samps(startOffset)
	);

	let normProgress = el.div({ key: key + '_div' }, progress, el.ms2samps(totalDurMs));

	return resolve(
		el.snapshot({ key, name: 'progress' }, el.train(rate ? rate * run : run), normProgress)
	);
}

export function progress(props: {
	key?: string;
	totalDurMs?: number;
	run: Signal | number;
	rate?: number;
	startOffset?: number;
}): Signal {
	return createNode(_progress, props, []);
}	
