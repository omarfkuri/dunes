import type { WatchListener } from "fs";
import type { 
  BuilderOptions,
  WatchOptions,
  CompileResult,
  ModuleMap,
  CSSAnalysis,
  HTMLFunction,
  ProduceOptions,
  MultiAction,
  BuildOptions,
  cssObj,
} from "../types/index.js";
import { copyFile, mkdir, rm } from "fs/promises";
import { basename, dirname, join } from "path";
import { WatchDir, readString, trav, writeStr } from "@dunes/sys";
import { splitLast } from "@dunes/tools/str";
import puppeteer from "puppeteer";
import jsb from "js-beautify";
import { Bundler, type BundlerConfig } from "@dunes/bundle";

export class SiteBuilder {

  #map: ModuleMap = new Map();
  #bundler: Bundler

  options: Required<BuilderOptions>

  constructor(options: BuilderOptions = {}) {
    this.options = {

      hash: null,

      out: "public",
      src: "src",
      views: {
        folder: "views",
        only: /\.tsx$/
      },
      assets: null,
      bundle: {},
      css: {
        match: /\.css/,
        file: "global.css",
        ext: "css",
        transform: source => source
      },
      lib: "lib.ts",
      main: "main.ts",
      base: "base.tsx",
      ...options,
    };

    this.#bundler = new Bundler(this.options.bundle);
  }

  async produce(options: ProduceOptions): Promise<void> {
    const start = Date.now();

    try {
      await options.onStart?.({builder: this});
      const goWrite = async (path: string): Promise<void> => {
        const start = Date.now();
        try {

          await options.onPageStart?.({
            took: 0, 
            builder: this,
            path
          });
          
          const page = await browser.newPage();
          const res = await page.goto(options.origin + path, {
            waitUntil: 'networkidle2'
          });

          if (res?.status() !== 200) {
            throw res?.statusText();
          }

          const str = await page.content();

          if (!path.endsWith("/index")) {
            path += "/index"
          }

          await writeStr(this.out(path) + ".html", jsb.html(str))

          await options.onPageSuccess?.({
            took: Date.now() - start, 
            builder: this,
            path
          });
        }
        catch(error) {
          if (!options.onPageFailure) {
            throw error;
          }          
          await options.onPageFailure?.({
            took: Date.now() - start, 
            builder: this,
            path,
            error
          });
        }
      }


      const browser = await puppeteer.launch({headless: "new"});
      const paths = await this.paths();

      for (const path of paths) {
        if (options.do && path in options.do) {
          const {ids, path: p} = await options.do[path]!(path);
          for (const {id} of ids) {
            await goWrite(join(p, id));
          }
        }
        else {
          await goWrite(path)
        }
      }

      await browser.close();
      await options.onSuccess?.({took: Date.now() - start, builder: this});
    }
    catch(error) {
      if (options.onFailure) {
        await options.onFailure({took: Date.now() - start, builder: this, error});
      }
      else {
        throw error;
      }
    }

  }

  async watch(options: WatchOptions): Promise<void> {

    const doAction = async (
      name: string, 
      func: () => Promise<any>, 
      style: boolean,
    ) => {
      const start = Date.now();

      try {
        await options.onFileBuilding?.({
          name, 
          style,
          took: 0,
          builder: this
        })
        await func();
        await options.onFileBuilt?.({
          name, 
          style,
          took: Date.now() - start,
          builder: this
        })
      }
      catch(error) {
        if (!options.onFileFailure) {
          console.warn(error);
          return;
        }
        await options.onFileFailure({
          name, 
          style, error, 
          took: Date.now() - start,
          builder: this
        })
      }
    }
    
    const listener: WatchListener<string> = async (_ch, fn) => {
      if (fn === null) return;
      const style = this.options.css.match.test(fn);

      if (fn == this.options.lib) {
        await doAction(fn, ()=> this.#libs(), style);
      }
      else if (fn == this.options.main) {
        await doAction(fn, ()=> this.#main(), style);
      }
      else if (fn == this.options.base) {
        await doAction(fn, ()=> this.#views(), style);
      }
      else if (
        fn.startsWith(this.options.views.folder) && 
        this.options.views.only.test(fn)
      ) {
        await doAction(fn, ()=> this.#view(fn), style);
      }

      else {
        const changes = new Map<string, Set<string>>();
        for (const [mod, comp] of this.#map) {
          for (const file of comp.bundle.watchFiles) {
            if (!file.endsWith(fn)) continue;
            if (!(mod in changes)) {
              changes.set(mod, new Set([fn]));
            }
            else {
              changes.get(mod)!.add(fn);
            }
          }
        }
        
        if (changes.size) {
          await options.onDepStart?.({changes, took: 0, style, builder: this})
          const actions = new Map<string, MultiAction>();
          const start = Date.now();
          for (const [mod, files] of changes) {
            if (mod == this.options.lib) {
              actions.set(mod, {mod, files, prom: ()=> this.#libs()})
            }
            else if (mod == this.options.main) {
              actions.set(mod, {mod, files, prom: ()=> this.#main()})
            }
            else if (mod == this.options.base) {
              actions.set(mod, {mod, files, prom: ()=> this.#views()})
            }
            else if (
              mod.startsWith(this.options.views.folder) && 
              this.options.views.only.test(mod)
            ) {
              actions.set(mod, {mod, files, prom: ()=> this.#view(mod)})
            }
          }



          for (const [mod, {files, prom}] of actions) {
            const start = Date.now();
            try {
              await options.onDepBuilding?.({
                name: fn, 
                files, 
                original: mod,
                style,
                took: 0,
                builder: this,
              })
              await prom();
              await options.onDepBuilt?.({
                name: fn, 
                files, 
                original: mod,
                style,
                took: Date.now() - start,
                builder: this,
              })
            }
            catch(error) {
              if (!options.onDepFailure) {
                console.warn(error);
                return;
              }
              await options.onDepFailure({
                name: fn, 
                files, 
                error, 
                original: mod,
                style,
                took: Date.now() - start,
                builder: this,
              })
            }

          }
          

          await options.onDepFinish?.({
            changes, 
            took: Date.now() - start, 
            style,
            builder: this
          })


        }
      }
      await this.#globalCSS();
    }

    const watcher = new WatchDir(
      this.options.src, 
      {
        recursive: true,
        delay: 220
      }, 
      listener
    );

    await options.onStart?.({builder: this});
    return watcher.start()
  }

  async build(options: BuildOptions): Promise<void> {
    const start = Date.now();
    try {
      await options.onStart?.({builder: this});
      await this.#env(options.clean);
      await this.#libs();
      await this.#main();
      await this.#views();
      await this.#globalCSS();
      await this.#assets();
      await options.onSuccess?.({took: Date.now() - start, builder: this});
    }
    catch(error) {
      if (options.onFailure) {
        await options.onFailure({took: Date.now() - start, builder: this, error});
      }
      else {
        throw error;
      }
    }  

  }

  src(name: string, ...names: string[]): string {
    return join(this.options.src, name, ...names)
  }

  out(name: string, ...names: string[]): string {
    return join(this.options.out, name, ...names)
  }

  hash(filename: string): string {
    const [name, ext] = splitLast(filename, ".", 0);
    return name + (
      this.options.hash ? ("." + this.options.hash): ""
    ) + ext;
  }

  #globalCSS() {
    let style = "";
    for (const [,{css}] of this.#map) {
      style += resultCSS(css);
    }
    return writeStr(this.hash(this.out(this.options.css.file)), style);
  }


  async #env(clean: boolean | undefined) {
    const out = this.out(this.options.views.folder);
    await mkdir(out, {recursive: true});
    if (clean) {
      await rm(this.options.out, {recursive: true})
    }
  }

  async #assets() {
    if (!this.options.assets) return;
    const {out, source} = this.options.assets;
    await trav(this.src(source), {
      onFile: async (parent, file) => {
        
        const outDir = out
          ? this.out(out, parent)
          : this.out(parent);

        await mkdir(outDir, {recursive: true});
        await copyFile(
          this.src(source, parent, file.name),
          join(outDir, file.name),
        )
      }
      
    })
  }

  async #libs() {
    try {
      const result = await this.#compile(this.src(this.options.lib), {
        treeshake: true,
        onConclude(code) {
          return code.replace(/export *{ .+ };? *\n*/, "");
        },
      });
      const code = await result.bundle.code();
      this.#map.set(this.options.lib, result);
      const paths = await this.paths();
      await writeStr(this.hash(this.out(this.options.lib.replace(/(\.\w+)+$/, ".js"))),
        `const paths = ${JSON.stringify(paths)};\nconst hash = ${
          this.options.hash? `"${this.options.hash}"`: "null"
        }\n` +
        code
      )
    }
    catch(err) {
      throw [this.options.lib, err]
    }
  }

  async paths(): Promise<string[]> {
    const paths: string[] = [];
    await trav(this.src(this.options.views.folder), {
      onFile: (parent, file) => {
        paths.push("/" + join(parent, file.name).replace(/(\.\w+)+$/, ""));
      }
    })
    return paths;
  }

  async #main() {
    try {
      const result = await this.#compile(this.src(this.options.main), {
        treeshake: false,
        onConclude(code) {
          return code.replace(/export *{ .+ };? *\n*/, "");
        },
      });
      const code = await result.bundle.code();
      this.#map.set(this.options.main, result);
      await writeStr(this.hash(this.out(this.options.main.replace(/(\.\w+)+$/, ".js"))),
        code
      )
    }
    catch(err) {
      throw [this.options.main, err]
    }
  }

  async #views() {
    await trav(this.src(this.options.views.folder), {
      onFile: async (parent, file) => {
        try {
          await this.#view(join(this.options.views.folder, parent, file.name));
        }
        catch(err) {
          throw [join(parent, file.name), err]
        }
      }
    })
  }

  async #view(path: string) {
    if (!this.options.views.only.test(path)) {
      return;
    }
    const result = await this.#compile(this.src(path), {
      treeshake: false
    });
    const code = await result.bundle.code();
    this.#map.set(path, result);
    const outPath = this.out(path.slice(this.options.views.folder.length))
    .replace(/\/index.tsx/, ".tsx")
    await writeStr(this.hash(outPath.replace(/(\.\w+)+$/, "/script.js")),
      code
    )
    await writeStr(this.hash(outPath.replace(/(\.\w+)+$/, "/styles.css")),
      resultCSS(result.css)
    )
    const html = await this.#html(path);
    await writeStr(outPath.replace(/(\.\w+)+$/, "/index.html"),
      html
    )

  }

  async #html(path: string): Promise<string> {
    try {
      const {bundle} = await this.#compile(this.src(this.options.base), {
        onConclude(code) {
          return code.replace(/export *{ .+ };? *\n*/, "");
        },
      });
      const htmlFuncSource = await bundle.code();
      const htmlFunc: HTMLFunction = eval(`${htmlFuncSource}; html;`);
      if (typeof htmlFunc !== "function") {
        throw `Base ${this.options.base} does not export a function called "html"`
      }
      const str = await htmlFunc({
        scripts: [
          `/${this.hash(this.options.lib.replace(/\.tsx?$/, ".js"))}`,
          `/${this.hash(this.options.main.replace(/\.tsx?$/, ".js"))}`,
        ],
        styles: [
          `/${this.hash(this.options.css.file)}`,
        ],
        path,
        builder: this
      })

      return str;
    }
    catch(err) {
      throw [this.options.base, err]
    }
  }

  async #compile(path: string, opts?: BundlerConfig): Promise<CompileResult> {
    let order = 0;
    const css: cssObj[] = []
    const source = await readString(path);
    const bundle = await this.#bundler.bundleScript(source, undefined, {
      ...opts,
      onLoad: async (source, filename) => {
        
        if (this.options.css.match.test(filename)) {
          const compiled = await this.options.css.transform(source);
          order++
          if (filename.endsWith(`.m.${this.options.css.ext}`)) {
            const data = analyzeCss(filename, compiled);
            css.push({text: data.css, order});
            return {
              text: `export default ${data.exports}`,
              stop: true,
            }
          }
          else {
            css.push({text: compiled, order});
            return {
              text: "export {}",
              stop: true,
            }
          }
        }

        if (this.options.bundle.onLoad)  {
          const bun = await this.options.bundle.onLoad(source, filename);
          if (bun) {
            if (bun.text) {
              source = bun.text;
            }
            if (bun.stop) {
              return {
                text: source,
                stop: bun.stop
              } 
            }
          }
        }
        if (opts?.onLoad)  {
          const bun = await opts?.onLoad(source, filename);
          if (bun) {
            if (bun.text) {
              source = bun.text;
            }
            if (bun.stop) {
              return {
                text: source,
                stop: bun.stop
              } 
            }
          }
        }
        return await opts?.onLoad?.(source, filename);

      },

      onConclude: async (code, filename) => {
        if (this.options.bundle.onConclude)  {
          code = await this.options.bundle.onConclude(code, filename);
        }
        if (opts?.onConclude)  {
          code = await opts?.onConclude(code, filename);
        }
        return code;
      },

      onResult: async (code, filename) => {
        if (this.options.bundle.onResult)  {
          const bun = await this.options.bundle.onResult(code, filename);
          if (bun) {
            if (bun.text) {
              code = bun.text;
            }
            if (bun.stop) {
              return {
                text: code,
                stop: bun.stop
              } 
            }
          }
        }
        if (opts?.onResult)  {
          const bun = await opts?.onResult(code, filename);
          if (bun) {
            if (bun.text) {
              code = bun.text;
            }
            if (bun.stop) {
              return {
                text: code,
                stop: bun.stop
              } 
            }
          }
        } 
      },

      onParse: async (ast, trav, filename) => {
        if (this.options.bundle.onParse)  {
          await this.options.bundle.onParse(ast, trav, filename);
        }
        if (opts?.onParse)  {
          await opts?.onParse(ast, trav, filename);
        }
      },
    });

    return {
      bundle,
      css
    }
  }
}

function resultCSS(result: cssObj[]): string {
  return result
    .sort((a, b) => a.order - b.order)
    .map(({text}) => text)
    .join("\n")
}


function analyzeCss(id: string, source: string): CSSAnalysis {

  source = source.replace(/"[^"]*"|'[^']*'/g, (x) => x.replaceAll(".", "$---DOT_HERE---$"));

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
    css: css.replaceAll("$---DOT_HERE---$", "."),
  }
}