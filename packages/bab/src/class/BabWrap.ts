
import parser from "@babel/parser";
import { transformFromAstSync, traverse } from "@babel/core";

import { File, Node, Scope, TraverseOptions, NodePath, TransformOptions } from "../types";


export class BabWrap {
  constructor(readonly parseOpts: parser.ParserOptions) {}

  read(source: string): Bab {
    return new Bab(parser.parse(source, this.parseOpts));
  }

  from(node: Node): Bab {
    const ast = parser.parse("", this.parseOpts);
    ast.program.body.push(node as any)
    return new Bab(ast);
  }
}

class Bab {
  constructor(readonly result: parser.ParseResult<File>) {}

  traverse(options: TraverseOptions, scope?: Scope, parent?: NodePath) {
    traverse(this.result, options, scope, parent);
  }

  convert(opts: TransformOptions) {
    return transformFromAstSync(this.result, undefined, opts);
  }

}