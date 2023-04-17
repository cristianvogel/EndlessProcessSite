import adapter from '@sveltejs/adapter-vercel';

import { vitePreprocess } from '@sveltejs/kit/vite';

const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessorsx
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		alias: {
			$stores: '/src/stores/stores.js'
		}
	}
};

export default config;
