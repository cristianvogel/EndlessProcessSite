/**
 * ElementaryAudio 🍄 CompositeNodes
 * https://www.elementary.audio/docs/guides/Understanding_Memoization#composite-nodes
 */

import { createNode, el, resolve } from '@elemaudio/core';
import { Utils } from '$lib/classes/Utils';
import type { StereoSignal, Signal } from 'src/typeDeclarations';

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
	const key = props.key || 'attenuate_' + Utils.generateRandomKey();
	return resolve(el.mul({ key: key }, props.level, el.sm(children[0].left)));
}

export function attenuate(props: { level: Signal | number; key?: string }, signal: Signal): Signal {
	return createNode(_attenuate, props, [signal]);
}


