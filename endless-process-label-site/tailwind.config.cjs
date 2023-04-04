/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		require('path').join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		container: {
			center: true
		},

		extend: {
			colors: {
				svelteOrange: '#FF3E00',
				svelteDark: '#F03A00',
				hotPink: '#FF1966'
			},
			fontSize: {
				xs: '0.5rem'
			}
		}
	},
	plugins: [
		...require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')(),
		require('@tailwindcss/typography')
	]
};
