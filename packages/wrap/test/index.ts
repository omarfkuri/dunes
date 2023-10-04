
import { Wrap, bab} from '../src';

try {
	const build = await Wrap.build({
		script: [
			'import {extract} from "@dunes/tools";',
			"",
			"const el: any = extract([<div>22</div>], 0);",
		].join("\n"),
		plugs: [
			bab({
				id: "script.tsx",
				jsx: {
					pragma: "Elem.create",
					useSpread: true
				},
			})
		],
		replaceBefore: [
			[/div/g, "span"]
		],
		replaceAfter: [
			[/div/g, "span"]
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
			{
				name: "rr",
				match: /\.css$/,
				action(source, id) {
				 return {
				 	data: {user: ""},
				 	text: false
				 }
				},
			}
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