// capitalisations in some component folder names were breaking builds
// as the repo was not syncing with the case sensitive file system on the server


import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
});

