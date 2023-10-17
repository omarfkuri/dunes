import parser, { type ParseResult, type ParserOptions } from "@babel/parser";
import { transformFromAstSync, traverse, type TransformOptions, type NodePath } from "@babel/core";
import type { File, Node } from "@babel/types";
import type { Scope, TraverseOptions } from "@babel/traverse";


export class BabWrap {
  #opts: TransformOptions | undefined
  constructor(
    readonly parseOpts: ParserOptions,
    opts?: TransformOptions
  ) {
    this.#opts = opts;
  }

  read(source: string): Bab {
    return new Bab(parser.parse(source, this.parseOpts), this.#opts);
  }

  from(node: Node): Bab {
    const ast = parser.parse("", this.parseOpts);
    ast.program.body.push(node as any)
    return new Bab(ast, this.#opts);
  }
}

class Bab {
  #opts: TransformOptions | undefined
  constructor(
    readonly result: ParseResult<File>, 
    opts: TransformOptions | undefined
  ) {
    this.#opts = opts;
  }

  traverse(options: TraverseOptions, scope?: Scope, parent?: NodePath) {
    traverse(this.result, options, scope, parent);
  }

  convert(opts?: TransformOptions) {
    return transformFromAstSync(this.result, undefined, {...this.#opts, ...opts});
  }

}

export { type Bab }