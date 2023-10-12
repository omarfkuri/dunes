
import { Wrap, act } from '../src';

try {
	const build = await Wrap.build({
		script: [
			'import {extract} from "@dunes/tools";',
			"",
			"const el = extract([2, 3], 0);",
		].join("\n"),
		plugs: [],
		replaceBefore: [
			[/div/g, "span"]
		],
		replaceAfter: [
			[/div/g, e => e]
		],
		treeshake: false,

		transform: [
			{
				name: "css",
				match: /\.css$/,
				action(source, id) {
				 return {
				 	data: {text: ""},
				 	text: false
				 }
				},
			},
			act({
				name: "rr",
				match: /\.css$/,
        prep(wrapOptions) {
          return 33;
        },
				action(source, id, p) {
				 return {
				 	data: {user: ""},
				 	text: false
				 }
				},
			})
		]

	})

	console.log("PASS");
	console.log(build.code)

	build.result.rr

}
catch(err) {
	console.log("FAILED");

	console.log((err as any).message)
	console.log((err as any).frame)
}