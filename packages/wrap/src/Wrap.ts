import "@dunes/tools"

import { writeStr } from "@dunes/sys"

import { InputPluginOption, Plugin, rollup } from 'rollup';
import virtual from '@rollup/plugin-virtual';

import { Acts, ActsResult, Opts, Result, StrResult } from "./types";


export class Wrap {
	private constructor() {}

	static async build<const A extends Acts>(options: Opts<A>): Promise<StrResult<A>> 
	static async build<const A extends Acts>(options: Opts<A>, outFile: string): Promise<Result<A>> 
	static async build<const A extends Acts>(options: Opts<A>, outFile?: string): Promise<StrResult<A> | Result<A>> {

		const result = {} as ActsResult<A>;
		if (options.transform) {
			for (const {name} of options.transform) {
				result[name as keyof typeof result] = []
			}
		}

		const build = await this.#createBuild(options, result);
		const {output} = await build.generate({
			format: options.format
		});

		let script = "";

		for (const chunk of output) {
			if (chunk.type === "chunk") {
				script += chunk.code;
			}
			else {
				throw `Unexpected chunk type "${chunk.type}"`
			}
		}

		if (options.replaceAfter) {
			for (const [m, t] of options.replaceAfter) {
				script = script.replace(m, t as string);
			}
		}


		if (!outFile) {
			return {
				code: script,
				watch: build.watchFiles, 
				result
			};
		}

		await writeStr(outFile, script);

		return {
			watch: build.watchFiles, 
			result
		}

	}


	static async #createBuild<A extends Acts>(opt: Opts<A>, results: ActsResult<A>) {

		const plugins: InputPluginOption = []

		if (opt.transform) {
			plugins.push(this.#transformers(opt.transform, results));
		}

		if (opt.plugs) {
			plugins.push(...opt.plugs);
		}

		if (opt.replaceBefore) {
			
			plugins.push({
				name: "replaceBefore",
				async transform(source) {
					for (const [m, t] of opt.replaceBefore!) {
						source = source.replace(m, t as string);
					}
					return source;
				}
			});
		}

		const isSTR = "script" in opt;

		if (isSTR) {
			plugins.push(virtual({script: opt.script}));
		}

		return await rollup({
			input: isSTR ? "script": opt.source,
			plugins,
			treeshake: opt.treeshake,
		});
	}


	static #transformers(As: Acts, res: ActsResult<any>): Plugin {
		return {
			name: "As",
			async transform(source, id) {

				for (const {name, match, action} of As) {
					if (match.test(id)) {
						const {data, text} = await action(source, id);
						if (data) {
							res[name]!.push(data)
						}
						if (text) {
							return text
						}
					}
				}

				return source;
			}
		}
	}
}
