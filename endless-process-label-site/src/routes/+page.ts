import { error } from '@sveltejs/kit';

export async function load({ fetch }) {
	const response = await fetch('/src/lib/audio/YohldteTvuezyz_AndersSkibsted.mp3');
	let sampleBuffer: ArrayBuffer = await response.arrayBuffer();

	if (response.ok) {
		return {
			body: sampleBuffer
		};
	}

	//todo: handle error with SvelteKit error page
	if (!response) throw error(404);
}
