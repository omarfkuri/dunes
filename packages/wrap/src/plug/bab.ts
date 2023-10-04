import { Plugin } from "rollup";

import { transformFromAstAsync } from "@babel/core";
import parser from "@babel/parser";
import { BabelOptions } from "../types";

export function bab(opts: BabelOptions): Plugin {
	return {
		name: "bab",
		async transform(source, id) {

			const ast = parser.parse(source, {
				sourceType: "module",
				plugins: ["typescript", "jsx"]
			});

			const filename = id.includes("virtual:script")? opts.id: id;

			const result = await transformFromAstAsync(ast, undefined, {
				filename,
				presets:  [
					["@babel/preset-typescript", opts.ts],
					["@babel/preset-react", opts.jsx],
				]
			})

			return result?.code || "undefined"
		}
	}
}