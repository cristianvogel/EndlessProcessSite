import adapter from '@sveltejs/adapter-auto';

import { vitePreprocess } from '@sveltejs/kit/vite';

const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessorsx
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter()
	}
};

export default config;
