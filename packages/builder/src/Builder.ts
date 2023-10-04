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
	CSSResult, CSSAnalysis, HanlderHandler, NamedHandlerHandler, CSSAct 
} from "./types";
import { Server } from "http";

export class Builder<const A extends Acts> {

	#working = false;
	#modules = new Map<string, BuilderModule>();

	constructor(private config: Config<A>) {}

	async build(options: BuildConfig = {}): Promise<number> {
		this.#working = true;
		const start = Date.now();

		if (options.clean) {
			await rm(this.config.public, {recursive: true})
		}
		
		await this.#forHandlers({
			str: (handler) => this.#buildRead(handler),
			sub: (handler) => this.#buildMulti(handler),
			sin: (handler) => this.#buildSingle(handler),
		})

		await writeStr(this.#out(this.config.globalCSSFile), await this.#globalStyles());
		this.#working = false;
		return Date.now() - start;
	}

	async watch(options: WatchConfig = {}): Promise<void> {

		const handleSin = async (handler: SingleHandler<A>, fn: string, styleChange: boolean) => {
			const start = Date.now();
			try {
				await options.onActionStart?.({
					type: "single", 
					filename: fn,
					style: styleChange
				});
				await this.#buildSingle(handler);
				await options.onActionSuccess?.({
					type: "single", 
					filename: fn,
					style: styleChange,
					took: Date.now() - start
				});
			}
			catch (error) {
				await options.onActionError?.({
					type: "single", 
					filename: fn,
					style: styleChange,
					took: Date.now() - start,
					error
				});
			}
		}

		const handleSub = async (handler: MultiHandler<A>, fn: string, styleChange: boolean): Promise<boolean> => {
			if (!fn.startsWith(handler.subDir)) 
				return false;

			const start = Date.now();
			try {
				await options.onActionStart?.({
					type: "sub-multi", 
					filename: fn,
					style: styleChange
				});
				await this.#buildSubMulti(handler, fn);
				await options.onActionSuccess?.({
					type: "sub-multi", 
					filename: fn,
					style: styleChange,
					took: Date.now() - start
				});
			}
			catch (error) {
				await options.onActionError?.({
					type: "sub-multi", 
					filename: fn,
					style: styleChange,
					took: Date.now() - start,
					error
				});
			}
			return true;
		}

		watch(this.config.src, {recursive: true},
			async (event, filename) => {
				if (this.#working || event === "rename" || !filename) return;

				this.#working = true;

				let normal = false;
				const styleChange = this.config.css.match.test(filename);

				await this.#forHandlers({
					str() {return},

					async sub(handler) {
						if (!await handleSub(handler, filename, styleChange)) {
							return;
						}
						normal = true;
					},

					async sin(handler) {
						await handleSin(handler, filename, styleChange);
						normal = true;
					}
				})

				if (!normal) {

					const modArrs: {[key: string]: true} = {};

					for (const [name, {watch}] of this.#modules) {
						for (const file of watch) {
							if (file.endsWith(filename)) {
								modArrs[name] = true;
							}
						}
					}

					await this.#forNamesHandlers(modArrs, {
						str() {return},
						
						async sub(name, handler) {
							await handleSub(handler, name, styleChange);
						},

						async sin(name, handler) {
							await handleSin(handler, name, styleChange);
						}
					})
				}

				try {
					await writeStr(this.#out(this.config.globalCSSFile), await this.#globalStyles());
				}
				catch(err) {
					console.log("Style error")
					console.warn(err)
				}

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

	async #globalStyles(): Promise<string> {
		let style = "";

		for (const {globalCSS} of this.#modules.values()) {
			if (!globalCSS) continue;
			style += "\n" + globalCSS;
		}

		return style;
	}

	async #forHandlers(func: HanlderHandler<A>): Promise<void> {
		const deffered: Handler<A>[] = [];
		for (const handler of this.config.handlers) {
			if (typeof handler.defer === "number") {
				deffered.push(handler);
				continue;
			}
			if ("string" in handler) {
				await func.str(handler);
			}
			else if ("subDir" in handler) {
				await func.sub(handler);
			}
			else {
				await func.sin(handler);
			}
		}


		for (const handler of deffered.sort((a, b) => a.defer! - b.defer!)) {
			if ("string" in handler) {
				await func.str(handler);
			}
			else if ("subDir" in handler) {
				await func.sub(handler);
			}
			else {
				await func.sin(handler);
			}
		}
	}

	async #forNamesHandlers(obj: {[key: string]: any},func: NamedHandlerHandler<A>): Promise<void> {
		const deffered: [string, Handler<A>][] = [];
		for (const name in obj) {
			for (const handler of this.config.handlers) {
				if (typeof handler.defer === "number") {
					deffered.push([name, handler]);
					continue;
				}
				if ("string" in handler) {
					await func.str(name, handler);
				}
				else if ("subDir" in handler) {
					await func.sub(name, handler);
				}
				else {
					await func.sin(name, handler);
				}
			}
		}


		for (const [name, handler] of deffered.sort(([,a], [,b]) => a.defer! - b.defer!)) {
			if ("string" in handler) {
				await func.str(name, handler);
			}
			else if ("subDir" in handler) {
				await func.sub(name, handler);
			}
			else {
				await func.sin(name, handler);
			}
		}
	}

	async #buildSingle(handler: SingleHandler<A>): Promise<void> {
		let globalStyles: string | null = null;
		const id = this.#src(handler.entry);
		const script = await readString(id);
		const result = await this.#build(id, script, handler);

		await writeStr(this.#out(handler.outFile), result.string);

		if (handler.outStylesFile) {
			await writeStr(this.#out(handler.outStylesFile), this.#resultCSS(result.result as CSSResult))
		}
		else {
			globalStyles = this.#resultCSS(result.result as CSSResult);
		}
		
		this.#modules.set(handler.entry, {
			globalCSS: globalStyles,
			type: "single",
			source: result.string,
			watch: result.watch
		})
	}

	async #buildRead(handler: ReadHandler<A>): Promise<void> {
		let globalStyles: string | null = null;
		const id = this.#src(handler.fakeName);
		const script = await readString(id);
		const result = await this.#build(id, script, handler);

		await writeStr(this.#out(handler.outFile), result.string);

		if (handler.outStylesFile) {
			await writeStr(this.#out(handler.outStylesFile), this.#resultCSS(result.result as CSSResult))
		}
		else {
			globalStyles = this.#resultCSS(result.result as CSSResult);
		}
		
		this.#modules.set(handler.fakeName, {
			globalCSS: globalStyles,
			type: "single",
			source: result.string,
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

	async #buildSubMulti(handler: MultiHandler<A>, fullName: string): Promise<void> {
		let globalStyles: string | null = null;
		const id = this.#src(fullName);
		const script = await readString(id);
		const result = await this.#build(id, script, handler);

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
			source: result.string,
			watch: result.watch
		})
	}

	async #build(id: string, script: string, handler: Handler<A> | undefined): Promise<InternalBuildResult> {
		let order = 0;
		const config = this.config.wrap?.(id);
		delete config?.transform;

		const build = await Wrap.build({
			...(config || {}),
			...(handler?.opt || {}),
			script, 
			transform: [{
				name: "css",
				match: this.config.css.match,
				action: async (source, id) => {

					const compiled = await this.config.css.transform(source);
					order++
					if (id.endsWith(".m.less")) {

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

}


