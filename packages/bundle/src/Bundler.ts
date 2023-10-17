import { readString, writeStr } from "@dunes/sys";
import type { BundlerConfig } from "./types.js";
import { rollup, type RollupBuild } from "rollup";
import parser from "@babel/parser";
import { type TransformOptions } from "@babel/core";
import nodeResolve from "@rollup/plugin-node-resolve";
import virtual from "@rollup/plugin-virtual";
import { resolve } from "path";
import { BabWrap } from "@dunes/bab";


export class Bundler {

  constructor(readonly config: BundlerConfig) {}

  async bundleFile(path: string, sub?: Partial<BundlerConfig>): Promise<Bundle> {
    const source = await readString(path);
    return this.bundleScript(source, path, sub);
  }
  
  async bundleScript(source: string, path = "script.ts", sub?: Partial<BundlerConfig>): Promise<Bundle> {

    const config = {
      ...this.config,
      ...sub
    }

    const parserOptions: parser.ParserOptions = {
      sourceType: "module",
      plugins: [
        "jsx", 
        "typescript", 
        "destructuringPrivate", 
        "importAttributes"
      ]
    }

    const transformOptions: TransformOptions = { presets: [] }

    if (config.jsx) {
      transformOptions.presets!.push(
        ["@babel/preset-react", config.jsx]
      );
    }

    if (config.ts !== false) {
      transformOptions.presets!.push(
        ["@babel/preset-typescript", config.ts]
      );
    }

    const babs = new BabWrap(
      parserOptions, 
      transformOptions
    );

    const {onParse, onLoad, onResult} = config
    const entry = resolve(path);
    const build = await rollup({
      input: "source",
      treeshake: config.treeshake,
      plugins: [
        {
          name: "parser",
          async transform(source, id) {
            const filename = id.startsWith("\0")? entry: id;
            const prepared = await onLoad?.(source, filename);
            if (prepared && prepared.text) {
              source = prepared.text;
              if (prepared.stop) return source;
            }
            const bab = babs.read(source);
            await onParse?.(bab, babs, filename);
            const code = bab.convert({ filename })?.code || "";
            const concluded = await onResult?.(code, filename);
            if (concluded && concluded.text) {
              source = concluded.text;
              if (concluded.stop) return source;
            }
            return code;
          }
        },
        (nodeResolve as any as typeof nodeResolve.default)(config.resolve),
        (virtual as any as typeof virtual.default)({source})
      ]
    })

    return new Bundle(entry, build, config);
  }

}



export class Bundle {
  #build: RollupBuild
  #config: BundlerConfig

  constructor(readonly entry: string, build: RollupBuild, config: BundlerConfig) {
    this.#build = build;
    this.#config = config;
  }

  get watchFiles() {
    return this.#build.watchFiles;
  }

  async code(): Promise<string> {
    const {output} = await this.#build.generate(
      this.#config.output || {}
    );
    let code = "";
    for (const chunk of output) {
      if (chunk.type === "chunk") {
        code += chunk.code + "\n";
      }
    }
    const finish = await this.#config.onConclude?.(code, this.entry);
    return finish || code;
  }

  async write(to: string): Promise<void> {
    await writeStr(to, await this.code());
  }

  async evaluate(): Promise<unknown> {
    return eval(await this.code());
  }
}


// export class Babs {
//   constructor(
//     public parseOptions: parser.ParserOptions,
//     public transformOptions: TransformOptions,
//   ) {}

//   parse(script: string, opts?: parser.ParserOptions): Bab {
//     const ast = parser.parse(script, {
//       ...this.parseOptions,
//       ...opts
//     });
//     return new Bab(ast, this);
//   }
// }

// export class Bab {
//   constructor(
//     public ast: parser.ParseResult<File>, 
//     public babs: Babs
//   ) {}

//   code(options: TransformOptions): string {
//     const r = transformFromAstSync(this.ast, undefined, {
//       ...this.babs.transformOptions,
//       ...options,
//     });
//     return r?.code || "";
//   }

//   traverse(options: import("@babel/traverse").TraverseOptions) {
//     traverse(this.ast, options);
//   }
// }
