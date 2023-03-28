<script lang="ts">
	import { _AudioEngine as AudioEngine, audioStatus } from '../stores/stores';
	import { el, type NodeRepr_t } from '@elemaudio/core';

	export let signal: NodeRepr_t;

	const core = $AudioEngine.core;
	if ($audioStatus === 'playing') {
		core?.render(el.fft({ name: 'elFFT' }, signal));
	}
</script>
