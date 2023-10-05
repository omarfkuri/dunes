
import resolve from "@rollup/plugin-node-resolve";
import { bab } from '@dunes/wrap';
import { Builder, handler } from '../src';


const builder = new Builder({
	src: "test/src",
	public: "test/pub",
	globalCSSFile: "globals.css",
	wrap: (id) => ({
		plugs: [
			resolve(),
			bab({
				id,
				jsx: {
					pragma: "Elem.create",
					useSpread: true,
				},
				keeps: new Set()
			})
		],
		treeshake: true
	}),

	css: {
		match: /\.css$/,
		ext: "css",
		async transform(source) {
		  return source;
		},
	},

	handlers: [
		handler({
			entry: "index.tsx",
			outFile: "index.js",
			defer: 2,
			process(str) {
				return str;
			},
			opt: {
				transform: [
					{
						name: "css",
						match: /\.css$/,
						action() {
							return {text: false}
						}
					}
				]
			}
		}),
		handler({
			match: /\.tsx?$/,
			subDir: "subdir",
			outDir: "sub/js",
			defer: 1,
			process(str) {
				return str;
			},
			outStylesDir: "sub/css",
		}),
		handler({
			string: "export const n = {name: 22};",
			outFile: "file.js",
			fakeName: "script.ts",
		})
	]
});

await builder.build({

	onBuildStart() {
		console.log("Building...")
	},

	onBuildFinish(took) {
	  console.log("Built in", took)
	},

});

builder.watch({

	onActionStart(e) {
	  if (e.type === "dependency") {
	  	console.log(`Rebuilding ${e.parents}`)
	  }
	  else {
	  	console.log(`Rebuilding ${e.filename}`)
	  }
	},

	onActionSuccess(e) {
	  if (e.type === "dependency") {
	  	console.log(`Rebuilt ${e.parents} in`, e.took)
	  }
	  else {
	  	console.log(`Rebuilt ${e.filename} in`, e.took)
	  }
	},

	onActionError(e) {
	  if (e.type === "dependency") {
	  	console.log(`Failed build -> ${e.parents} | `, e.took)
	  }
	  else {
	  	console.log(`Failed build -> ${e.filename} | `, e.took)
	  }
	},


});
console.log("watching")