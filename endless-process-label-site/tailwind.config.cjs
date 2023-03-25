/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}', require('path').join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')],
	theme: {
		extend: {
			colors: {
				svelteOrange: '#FF3E00',
				svelteDark: '#F03A00',
				hotPink: '#FF1966',
			}
		},
	},
	plugins: [...require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')(),require('@tailwindcss/typography')],
}
