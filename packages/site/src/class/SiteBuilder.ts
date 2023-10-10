import { WatchListener, watch } from "fs";
import { 
  SiteBuildConfig,
  BuildOptions,
  BuildResult,
  WatchOptions,
  WatchResult,
  CompileOptions,
  CompileResult,
  ModuleMap,
  CSSResult,
  CSSAnalysis,
  HTMLFunction,
} from "../types";
import { mkdir, rm } from "fs/promises";
import { basename, dirname, join } from "path";
import { WatchDir, readString, trav, writeStr } from "@dunes/sys";
import { Wrap } from "@dunes/wrap";
import {  } from "@dunes/wrap-plug";

export class SiteBuilder {

  #map: ModuleMap = new Map();

  config: Required<SiteBuildConfig>

  constructor(config: SiteBuildConfig = {}) {
    this.config = {

      out: "public",
      src: "src",
      views: {
        folder: "views",
        only: /\.tsx$/
      },
      wrap: {},
      css: {
        match: /\.css/,
        file: "global.css",
        ext: "css",
        transform: source => source
      },
      lib: "lib.ts",
      main: "main.ts",
      base: "base.tsx",

      ...config,
    };
  }

  watch(options: WatchOptions): WatchResult {

    const doAction = async (
      name: string, 
      type: "dependency" | "file", 
      func: () => Promise<any>, 
      files?: Set<string>,
    ) => {
      const start = Date.now();
      try {
        await options.onActionStart?.({
          name, type, files, original: name,
          took: 0,
        })
        await func();
        await options.onActionFinish?.({
          name, type, files, original: name,
          took: Date.now() - start,
        })
      }
      catch(error) {
        if (!options.onActionFailure) {
          console.warn(error);
          return;
        }
        await options.onActionFailure({
          name, type, files, error, original: name,
          took: Date.now() - start,
        })
      }
    }
    
    const listener: WatchListener<string> = async (_ch, fn) => {
      if (fn === null) return;

      if (fn == this.config.lib) {
        await doAction(fn, "file", ()=> this.#libs(null));
      }
      else if (fn == this.config.main) {
        await doAction(fn, "file", ()=> this.#main());
      }
      else if (fn == this.config.base) {
        await doAction(fn, "file", ()=> this.#views());
      }
      else if (
        fn.startsWith(this.config.views.folder) && 
        this.config.views.only.test(fn)
      ) {
        await doAction(fn, "file", ()=> this.#view(fn));
      }

      else {
        const changed = new Map<string, Set<string>>();
        for (const [mod, comp] of this.#map) {
          for (const file of comp.watch) {
            if (!file.endsWith(fn)) continue;
            if (!(mod in changed)) {
              changed.set(mod, new Set([fn]));
            }
            else {
              changed.get(mod)!.add(fn);
            }
          }
        }
        for (const [mod, files] of changed) {
          if (mod == this.config.lib) {
            await doAction(mod, "dependency", ()=> this.#libs(null), files);
          }
          else if (mod == this.config.main) {
            await doAction(mod, "dependency", ()=> this.#main(), files);
          }
          else if (mod == this.config.base) {
            await doAction(mod, "dependency", ()=> this.#views(), files);
          }
          else if (
            mod.startsWith(this.config.views.folder) && 
            this.config.views.only.test(mod)
          ) {
            await doAction(mod, "dependency", ()=> this.#view(mod), files);
          }
        }
      }
      await this.#globalCSS();
    }

    const watcher = new WatchDir(
      this.config.src, 
      {
        recursive: true,
        delay: 220
      }, 
      listener
    );

    return watcher.start()
  }

  async build(options: BuildOptions): BuildResult {
    const start = Date.now();
    await this.#env(options.clean);
    await this.#libs(options.hash || null);
    await this.#main();
    await this.#views();
    await this.#globalCSS();

    return {took: Date.now() - start}
  }

  src(name: string, ...names: string[]): string {
    return join(this.config.src, name, ...names)
  }

  out(name: string, ...names: string[]): string {
    return join(this.config.out, name, ...names)
  }

  #globalCSS() {
    let style = "";
    for (const [,{result}] of this.#map) {
      style += resultCSS(result) + "\n"
    }
    return writeStr(this.out(this.config.css.file), style);
  }


  async #env(clean: boolean | undefined) {
    const out = this.out(this.config.views.folder);
    await mkdir(out, {recursive: true});
    if (clean) {
      await rm(this.config.out, {recursive: true})
    }
  }

  async #libs(hash: string | null) {
    try {
      const result = await this.#compile(this.src(this.config.lib), {
        treeshake: true,
        replaceAfter: [
          [/export *{ .+ };? *\n*/, ""],
        ]
      });
      this.#map.set(this.config.lib, result);
      const paths: string[] = [];
      await trav(this.src(this.config.views.folder), {
        onFile: (parent, file) => {
          paths.push("/" + join(parent, file.name).replace(/(\.\w+)+$/, ""));
        }
      })
      await writeStr(this.out(this.config.lib.replace(/(\.\w+)+$/, ".js")),
        `const paths = ${JSON.stringify(paths)};\nconst hash = ${hash? `"${hash}"`: "null"}\n` +
        result.code
      )
    }
    catch(err) {
      throw [this.config.lib, err]
    }
  }

  async #main() {
    try {
      const result = await this.#compile(this.src(this.config.main), {
        treeshake: false,
        replaceAfter: [
          [/export *{ .+ };? *\n*/, ""],
        ]
      });
      this.#map.set(this.config.main, result);
      await writeStr(this.out(this.config.main.replace(/(\.\w+)+$/, ".js")),
        result.code
      )
    }
    catch(err) {
      throw [this.config.main, err]
    }
  }

  async #views() {
    await trav(this.src(this.config.views.folder), {
      onFile: async (parent, file) => {
        try {
          await this.#view(join(this.config.views.folder, parent, file.name));
        }
        catch(err) {
          throw [join(parent, file.name), err]
        }
      }
    })
  }

  async #view(path: string) {
    if (!this.config.views.only.test(path)) {
      return;
    }
    const result = await this.#compile(this.src(path), {
      treeshake: false
    });
    this.#map.set(path, result);
    const outPath = this.out(path.slice(this.config.views.folder.length))
    .replace(/\/index.tsx/, ".tsx")
    await writeStr(outPath.replace(/(\.\w+)+$/, "/script.js"),
      result.code
    )
    await writeStr(outPath.replace(/(\.\w+)+$/, "/styles.css"),
      resultCSS(result.result)
    )
    const html = await this.#html(result.code);
    await writeStr(outPath.replace(/(\.\w+)+$/, "/index.html"),
      html
    )

  }

  async #html(script: string): Promise<string> {
    try {
      const {code: htmlFuncSource} = await this.#compile(this.src(this.config.base), {
        replaceAfter: [
          [/export *{ .+ };? *\n*/, ""],
        ]
      });
      // let lib = this.#map.get(this.config.lib);
      // if (!lib) {
      //   throw "lib has not been written for html to create"
      // }
      const htmlFunc: HTMLFunction = eval(`${htmlFuncSource}; html;`);
      if (typeof htmlFunc !== "function") {
        throw `Base ${this.config.base} does not export a function called "html"`
      }
      const body = await this.#extractBody(script);
      const str = await htmlFunc({
        scripts: [
          `/${this.config.lib.replace(/\.tsx?$/, ".js")}`,
          `/${this.config.main.replace(/\.tsx?$/, ".js")}`,
        ],
        styles: [
          `/${this.config.css.file}`,
        ],
        body
      })

      return str;
    }
    catch(err) {
      throw [this.config.base, err]
    }
  }

  async #extractBody(script: string): Promise<string> {
    return ""
  }

  async #compile(path: string, opts?: CompileOptions): Promise<CompileResult> {
    const script = await readString(path);
    let order = 0;

    return await Wrap.build({
      ...this.config.wrap,
      ...opts,
      replaceAfter: [
        ...(this.config.wrap.replaceAfter || []),
        ...(opts?.replaceAfter || []),
      ],
      script,
      transform: [{
        name: "css",
        match: this.config.css.match,
        action: async (source, id) => {

          const compiled = await this.config.css.transform(source);
          order++
          if (id.endsWith(`.m.${this.config.css.ext}`)) {
            const data = analyzeCss(id, compiled);
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
      }]
    });
  }
}


function resultCSS(result: CSSResult): string {
  return result.css
    .sort((a, b) => a.order - b.order)
    .map(({text}) => text)
    .join("\n")
}

function analyzeCss(id: string, source: string): CSSAnalysis {
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