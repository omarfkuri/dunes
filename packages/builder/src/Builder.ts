import { readString, trav, writeStr } from "@dunes/sys";
import { basename, dirname, join, resolve } from "path";
import { rm } from "fs/promises";
import express from "express";
import { Acts, ActsResult, Wrap } from "@dunes/wrap";
import { watch } from "fs";
import type {
	MultiHandler, SingleHandler, BuilderModule, 
	Config, Handler, ServerConfig, BuildConfig, 
	WatchConfig, ReadHandler, InternalBuildResult, 
	CSSResult, CSSAnalysis, ModuleType 
} from "./types";
import { Server } from "http";


export class Builder<const A extends Acts> {

	#working = false;
	#modules = new Map<string, BuilderModule>();

	constructor(private config: Config<A>) {
		this.config.handlers = (config.handlers as Handler<A>[]).sort(
			(a, b) => (a.defer || 0) - (b.defer || 0)
		)
	}

	#src(name: string, ...names: string[]): string {
		return join(this.config.src, name, ...names)
	}

	#out(name: string, ...names: string[]): string {
		return join(this.config.public, name, ...names)
	}

	#resultCSS(result: CSSResult): string {
		return result.css
			.sort((a, b) => a.order - b.order)
			.map(({text}) => text)
			.join("\n")
	}

	#analyzeCss(id: string, source: string): CSSAnalysis {
		let styleID = basename(id.split(".")[0]!);

		while (styleID == "style" || styleID == "styles" || styleID == "global") {		
			styleID = basename(dirname(id));
		}

		function makeID(name: string) {
			return styleID + "_" + id.length + "_" + name;
		}

		const mm = source.match(/(?<!\d)\.[\w-_]+/g) || [];
		const css = source.replace(/(?<!\d)\.[\w-_]+/g, s => "." + makeID(s.slice(1)))

		return {
			exports: JSON.stringify(Object.fromEntries(
				mm.map(str => {
					const noDot = str.replace(/^\./, "");
					return [noDot, makeID(noDot)]
				})
			), null, 2),
			css,
		}
	}

	#globalStyles(): Promise<void> {
		let style = "";

		for (const {globalCSS} of this.#modules.values()) {
			if (!globalCSS) continue;
			style += "\n" + globalCSS;
		}

		return writeStr(this.#out(this.config.globalCSSFile), style);
	}

	async #writeSingle(handler: ReadHandler<A> | SingleHandler<A>, result: InternalBuildResult): Promise<string | null> {
		await writeStr(this.#out(handler.outFile), result.string);

		if (handler.outStylesFile) {
			await writeStr(this.#out(handler.outStylesFile), this.#resultCSS(result.result as CSSResult))
			return null;
		}
		else {
			return this.#resultCSS(result.result as CSSResult);
		}
	}

	async #buildSingle(handler: SingleHandler<A>): Promise<void> {
		const id = this.#src(handler.entry);
		const source = await readString(id);
		const result = await this.#compile(id, source, handler);
		const globalCSS = await this.#writeSingle(handler, result);
		
		this.#modules.set(handler.entry, {
			globalCSS,
			type: "single",
			watch: result.watch
		})
	}

	async #buildRead(handler: ReadHandler<A>): Promise<void> {
		const result = await this.#compile(handler.fakeName, handler.string, handler);
		const globalCSS = await this.#writeSingle(handler, result);
		
		this.#modules.set(handler.fakeName, {
			globalCSS,
			type: "string",
			watch: result.watch
		})
	}

	async #buildSubMulti(handler: MultiHandler<A>, fullName: string): Promise<void> {
		if (!handler.match.test(fullName) || !fullName.startsWith(handler.subDir)) {
			return;
		}

		let globalStyles: string | null = null;
		const id = this.#src(fullName);
		const script = await readString(id);
		const result = await this.#compile(id, script, handler);

		let filename;

		if ("outDir" in handler) {
			filename = join(handler.outDir, `${fullName.replace(new RegExp(`^${handler.subDir}`), "").replace(handler.match, "")}.js`)
		}
		else {
			filename = handler.outFile;
		}

		let styleFilename: string | null = null;
		if ("outStylesDir" in handler && handler.outStylesDir) {
			styleFilename = this.#out(handler.outStylesDir, `${fullName.replace(new RegExp(`^${handler.subDir}`), "").replace(handler.match, "")}.css`);
		}
		else if ("outStylesFile" in handler && handler.outStylesFile) {
			styleFilename = this.#out(handler.outStylesFile);
		}
		else {
			globalStyles = this.#resultCSS(result.result as CSSResult);
		}

		await writeStr(this.#out(filename), result.string);
		styleFilename && await writeStr(styleFilename, this.#resultCSS(result.result as CSSResult));
		
		this.#modules.set(fullName, {
			globalCSS: globalStyles,
			type: "sub-multi",
			watch: result.watch
		})
	}

	async #buildMulti(handler: MultiHandler<A>): Promise<void> {
		await trav(this.#src(handler.subDir), {
			onFile: (parent, {name}) => this.#buildSubMulti(
				handler, 
				join(handler.subDir, parent, name), 
			)
		});
	}


	async #compile(id: string, source: string, handler: Handler<A> | undefined): Promise<InternalBuildResult> {
		let order = 0;
		const config = this.config.wrap?.(id);
		delete config?.transform;

		const build = await Wrap.build({
			...(config || {}),
			...(handler?.opt || {}),
			script: source, 
			transform: [{
				name: "css",
				match: this.config.css.match,
				action: async (source, id) => {

					const compiled = await this.config.css.transform(source);
					order++
					if (id.endsWith(`.m.${this.config.css.ext}`)) {

						const data = this.#analyzeCss(id, compiled);
						return {
							text: `export default ${data.exports}`,
							data: {text: data.css, order}
						}
					}
					else {
						return {
							text: "export {}",
							data: {text: compiled, order}
						}
					}
				}
			}, ...((this.config.wrap?.(id)?.transform || []))],

		});

		return {
			string: (
				handler?.process
				? await handler.process(build.code, {
						modules: [...this.#modules.keys()],
						hash: this.config.hash || null,
						results: build.result as ActsResult<A>
					})
				: build.code
			),
			result: build.result,
			watch: build.watch
		};
	}

	async build(options: BuildConfig = {}): Promise<void> {
		this.#working = true;
		const start = Date.now();
		await options.onBuildStart?.();

		if (options.clean) {
			await rm(this.config.public, {recursive: true});
		}

		for (const handler of this.config.handlers) {
			if ("string" in handler) {
				await this.#buildRead(handler)
			}
			else if ("entry" in handler) {
				await this.#buildSingle(handler)
			}
			else {
				await this.#buildMulti(handler)
			}
		}

		await this.#globalStyles();
		await options.onBuildFinish?.(Date.now() - start);

		this.#working = false;
	}

	watch(options: WatchConfig = {}) {
		return watch(this.config.src, {recursive: true},
			async (ch, fn) => {
				if (this.#working || ch === "rename" || !fn) {
					return;
				}
				this.#working = true;

				const mod = this.#modules.get(fn);
				const styleChange = this.config.css.match.test(fn);

				if (mod) {

					for (const handler of this.config.handlers) {
						if ("string" in handler) {
							continue;
						}
						else if ("entry" in handler) {
							if (fn === handler.entry) {
								const start = Date.now();
								try {
									await options.onActionStart?.({
										type: "single", 
										filename: fn,
										style: styleChange
									});
									await this.#buildSingle(handler);
									const took = Date.now() - start;
									await options.onActionSuccess?.({
										type: "single", 
										filename: fn,
										style: styleChange,
										took,
									});
								}
								catch (error) {
									const took = Date.now() - start;
									await options.onActionError?.({
										type: "single", 
										filename: fn,
										style: styleChange,
										took,
										error
									});
								}
								finally {
									break;
								}
							}
						}
						else if (fn.startsWith(handler.subDir) && handler.match.test(fn)) {
							const start = Date.now();
							try {
								await options.onActionStart?.({
									type: "sub-multi", 
									filename: fn,
									style: styleChange
								});
								await this.#buildSubMulti(handler, fn);
								const took = Date.now() - start;
								await options.onActionSuccess?.({
									type: "sub-multi", 
									filename: fn,
									style: styleChange,
									took,
								});
							}
							catch (error) {
								const took = Date.now() - start;
								await options.onActionError?.({
									type: "sub-multi", 
									filename: fn,
									style: styleChange,
									took,
									error
								});
							}
							finally {
								break;
							}
						}
					}
				}

				else {
					const modArrs: [type: ModuleType, name: string][] = [];

					for (const [name, mod] of this.#modules) {
						for (const file of mod.watch) {
							if (file.endsWith(fn)) {
								modArrs.push([mod.type, name]);
							}
						}
					}

					const promises: {[key: string]: ["single" | "sub-multi", Handler<A>]} = {}
					for (const [ty, nm] of modArrs) {
						sub:
						for (const handler of this.config.handlers) {
							if ("string" in handler) {
								continue;
							}
							else if ("entry" in handler) {
								if (ty !== "single") continue;

								promises[nm] = ["single", handler];
								break sub;
							}
							else if (nm.startsWith(handler.subDir) && handler.match.test(nm)) {
								if (ty !== "sub-multi") continue;

								promises[nm] = ["sub-multi", handler];
								break sub;
							}
						}
					}
					const parents = Object.keys(promises);

					const start = Date.now();
					try {
						await options.onActionStart?.({
							type: "dependency",
							parents,
							filename: fn,
							style: styleChange
						});
						for (const name in promises) {
							const [ty, h] = promises[name] as ["single" | "sub-multi", Handler<A>];
							if (ty === "single") {
								await this.#buildSingle(h as SingleHandler<A>)
							}
							else {
								await this.#buildSubMulti(h as MultiHandler<A>, name)
							}
						}
						const took = Date.now() - start;
						await options.onActionSuccess?.({
							type: "dependency",
							parents,
							filename: fn,
							style: styleChange,
							took,
						});
					}
					catch (error) {
						const took = Date.now() - start;
						await options.onActionError?.({
							type: "dependency",
							parents,
							filename: fn,
							style: styleChange,
							took,
							error
						});
					}
				}
				await this.#globalStyles();
				this.#working = false;
			}
		)
	}

	async serve(options: ServerConfig = {port: 3000}): Promise<Server> {
		const app = express();

		if (options.static) {
			app.use(express.static(this.config.public));
		}
		else {
			app.get("/*", async (req, res) => {
				if (options.api) {
					const {stop} = await options.api(req, res);
					if (stop) return;
				}
				if (req.url.match(/\.\w+$/)) {
					res.sendFile(resolve(join(this.config.public, req.url)))
				}
				else {
					res.sendFile(resolve(join(this.config.public, "index.html")))	
				}
			})
		}
		
		return await new Promise(res => {
			const server = app.listen(options.port, () => res(server))
		})
	}

}


