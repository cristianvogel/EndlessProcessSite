import { createNode, el, resolve } from '@elemaudio/core';
import type { NodeRepr_t } from '@elemaudio/core';

function CompositeDualDelay({ props, children }): NodeRepr_t {
	return resolve(
		el.add(
			el.delay({ key: 'private1', size: 44100 }, el.ms2samps(props.len), props.fb, children[0]),
			el.delay(
				{ key: 'private2', size: 44100 },
				el.ms2samps(props.len * 0.75),
				props.fb,
				children[1]
			)
		)
	);
}

export function dualDelay(props, inputL: NodeRepr_t, inputR: NodeRepr_t): NodeRepr_t {
	return createNode(CompositeDualDelay, props, [inputL, inputR]);
}
