export const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".DS_Store","64243fb03a545b1270a82eca_64241579f2fb69c45daefeb9_nx.jpg","64243fb03a545b1270a82eca_64241579f2fb69c45daefeb9_ny.jpg","64243fb03a545b1270a82eca_64241579f2fb69c45daefeb9_nz.jpg","64243fb03a545b1270a82eca_64241579f2fb69c45daefeb9_px.jpg","64243fb03a545b1270a82eca_64241579f2fb69c45daefeb9_py.jpg","64243fb03a545b1270a82eca_64241579f2fb69c45daefeb9_pz.jpg","Default_Avatar.svg","ElevenLabsLogo.svg","audio/.DS_Store","audio/mp3/01_Cutterhead-HeavenOrHell.mp3","audio/mp3/CitiesVersion_CristianVogel.mp3","audio/mp3/YohldteTvuezyz_AndersSkibsted.mp3","audio/mp3/sound.mp3","audio/mp3/speech/test.mp3","cables/.DS_Store","cables/ENDPROC010/.DS_Store","cables/ENDPROC010/LICENCE","cables/ENDPROC010/cables.txt","cables/ENDPROC010/credits.txt","cables/ENDPROC010/doc.md","cables/ENDPROC010/index.html","cables/ENDPROC010/legal.txt","cables/ENDPROC010/lib_lut_lut5.jpg","cables/ENDPROC010/lib_matcaps_droplet_01.png","cables/ENDPROC010/patch.js","cables/ENDPROC010/patch_v1.1.js","cables/ENDPROC010/screenshot.png","favicon.png","fonts/Inter-Regular.ttf","fonts/Inter-VariableFont_slnt,wght.ttf","fonts/OFL.txt","fonts/README.txt","meterSegment.svg"]),
	mimeTypes: {".jpg":"image/jpeg",".svg":"image/svg+xml",".mp3":"audio/mpeg",".txt":"text/plain",".md":"text/markdown",".html":"text/html",".png":"image/png",".js":"application/javascript",".ttf":"font/ttf"},
	_: {
		client: {"start":{"file":"_app/immutable/entry/start.acdd53a1.js","imports":["_app/immutable/entry/start.acdd53a1.js","_app/immutable/chunks/index.e0ddd94a.js","_app/immutable/chunks/singletons.0350d69d.js","_app/immutable/chunks/index.a6204cf7.js","_app/immutable/chunks/control.e7f5239e.js"],"stylesheets":[],"fonts":[]},"app":{"file":"_app/immutable/entry/app.cc9391c3.js","imports":["_app/immutable/entry/app.cc9391c3.js","_app/immutable/chunks/index.e0ddd94a.js"],"stylesheets":[],"fonts":[]}},
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
