import { Plugin } from "rollup";

import { transformFromAstSync, traverse } from "@babel/core";
import parser from "@babel/parser";
import { BabelOptions } from "../types";
import { dirname, join, resolve } from "path";
import { existsSync } from "fs";
import { File, Node } from "@babel/types";

export function bab(opts: BabelOptions): Plugin {
	const extensions = ["ts", "tsx", "js", "jsx"];

	function makeFile(pastDir: string, src: string): string {
		let fileDir = src;
		
		if (src.match(/^\.{1,2}\//)) {
			fileDir = join(pastDir, src);
		}

		fileDir = resolve(fileDir);

		let fileName: string | null = null;

		for (const ext of extensions) {
			const joined = `${fileDir}.${ext}`;
			if (existsSync(joined)) {
				fileName = joined;
				break;
			}
			const indexJoined = `${fileDir}/index.${ext}`;
			if (existsSync(indexJoined)) {
				fileName = indexJoined;
				break;
			}
		}
		if (!fileName) {
			return src;
		}

		return fileName;
	}

	function parse(source: string): parser.ParseResult<File> {
		return parser.parse(source, {
			sourceType: "module",
			plugins: ["typescript", "jsx", "destructuringPrivate"]
		});
	}

	function convertNode(node: Node, filename: string): string | null{
		const ast = parse("");
		ast.program.body.push(node as any)
		return convert(ast, filename);
	}

	function convert(node: parser.ParseResult<File>, filename: string): string | null {
		return transformFromAstSync(node, undefined, {
			filename,
			presets: [
				["@babel/preset-typescript", opts.ts],
				["@babel/preset-react", opts.jsx],
			]
		})?.code || null
	}


	return {
		name: "bab",
		transform(source, id) {

			const ast = parse(source);

			const filename = id.includes("virtual:script")? opts.id: id;
			const pastDir = dirname(filename);

			traverse(ast, {
				ImportDeclaration(path) {
					if (path.node.leadingComments) {
						const comment = path.node.leadingComments[path.node.leadingComments.length-1];
						if (comment && comment.value.match(/\s*@keep\s*/)) {

							if (path.node.leadingComments?.length) {
								path.node.leadingComments = path.node.leadingComments.filter(e => e && !e.value.match(/\s*@keep\s*/))
							}
							if (path.node.trailingComments?.length) {
								path.node.trailingComments = path.node.trailingComments.filter(e => e && !e.value.match(/\s*@keep\s*/))
							}
							

							const r = convertNode(path.node, "");
							if (r) {
								opts.keeps.add(r)
							}

							path.remove();
							return;
						}
					}
					if (path.node.source.type == "StringLiteral") {
						path.node.source.value = makeFile(pastDir, path.node.source.value);
					}
				},
				ExportDeclaration(path) {
					if (path.node.type == "ExportAllDeclaration") {
						path.node.source.value = makeFile(pastDir, path.node.source.value);
					}
					else if (path.node.type == "ExportNamedDeclaration") {
						if (path.node.source?.type == "StringLiteral") {
							path.node.source.value = makeFile(pastDir, path.node.source.value);
						}
					}
					else if (path.node.declaration.type == "StringLiteral") {
						path.node.declaration.value = makeFile(pastDir, path.node.declaration.value);
					}
				}
			});

			return convert(ast, filename);
		}
	}
}