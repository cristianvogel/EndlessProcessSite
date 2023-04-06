/**
 * ElementaryAudio 🍄 CompositeNodes
 * https://www.elementary.audio/docs/guides/Understanding_Memoization#composite-nodes
 */

import { createNode, el, resolve } from '@elemaudio/core';
import type { StereoSignal, Signal } from 'src/typeDeclarations';

//--- detunedSaws --------------------------------------------------------

function dualSaw({ props, children }): Signal {
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
	return createNode(dualSaw, props, [frequency]);
}

//--- cleanStereoOut --------------------------------------------------------

function leftOut({ props, children }): Signal {
	return resolve(el.mul(props.level, el.sm(children[0].left)));
}

function rightOut({ props, children }): Signal {
	return resolve(el.mul(props.level, el.sm(children[0].right)));
}

export function cleanStereoOut(
	props: { level: Signal | number },
	stereoSignal: StereoSignal
): StereoSignal {
	return {
		left: createNode(leftOut, props, [stereoSignal.left]),
		right: createNode(rightOut, props, [stereoSignal.right])
	};
}
