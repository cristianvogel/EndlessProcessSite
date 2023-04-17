export const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".DS_Store","64243fb03a545b1270a82eca_64241579f2fb69c45daefeb9_nx.jpg","64243fb03a545b1270a82eca_64241579f2fb69c45daefeb9_ny.jpg","64243fb03a545b1270a82eca_64241579f2fb69c45daefeb9_nz.jpg","64243fb03a545b1270a82eca_64241579f2fb69c45daefeb9_px.jpg","64243fb03a545b1270a82eca_64241579f2fb69c45daefeb9_py.jpg","64243fb03a545b1270a82eca_64241579f2fb69c45daefeb9_pz.jpg","Default_Avatar.svg","ElevenLabsLogo.svg","favicon.png","fonts/Inter-Regular.ttf","fonts/Inter-VariableFont_slnt,wght.ttf","fonts/OFL.txt","fonts/README.txt","meterSegment.svg"]),
	mimeTypes: {".jpg":"image/jpeg",".svg":"image/svg+xml",".png":"image/png",".ttf":"font/ttf",".txt":"text/plain"},
	_: {
		client: {"start":{"file":"_app/immutable/entry/start.298ccba9.js","imports":["_app/immutable/entry/start.298ccba9.js","_app/immutable/chunks/index.e7457da3.js","_app/immutable/chunks/singletons.f2aa4beb.js","_app/immutable/chunks/index.d59d1eb0.js","_app/immutable/chunks/control.e7f5239e.js"],"stylesheets":[],"fonts":[]},"app":{"file":"_app/immutable/entry/app.eeca177a.js","imports":["_app/immutable/entry/app.eeca177a.js","_app/immutable/chunks/preload-helper.41c905a7.js","_app/immutable/chunks/index.e7457da3.js"],"stylesheets":[],"fonts":[]}},
		nodes: [
			() => import('../output/server/nodes/0.js'),
			() => import('../output/server/nodes/1.js'),
			() => import('../output/server/nodes/2.js'),
			() => import('../output/server/nodes/3.js'),
			() => import('../output/server/nodes/4.js')
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0], errors: [1], leaf: 2 },
				endpoint: null
			},
			{
				id: "/blog",
				pattern: /^\/blog\/?$/,
				params: [],
				page: { layouts: [0], errors: [1], leaf: 3 },
				endpoint: null
			},
			{
				id: "/latest/[slug]",
				pattern: /^\/latest\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0], errors: [1], leaf: 4 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};
