
import { bab } from '@dunes/wrap';
import { Builder, handler } from '../src';


const builder = new Builder({
	src: "test",
	public: "test/pub",
	globalCSSFile: "globals.css",
	wrap: (id) => ({
		plugs: [bab({
			id,
			jsx: {
				pragma: "Elem.create",
				useSpread: true,
			},
		})],
		treeshake: true
	}),

	css: {
		match: /\.css$/,
		async transform(source) {
		  return source;
		},
	},

	handlers: [
		handler({
			entry: "test.tsx",
			outFile: "index.js",
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
		})
	]
});

await builder.build();
process.exit(0);