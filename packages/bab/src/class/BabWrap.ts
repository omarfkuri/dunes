
import parser from "@babel/parser";
import { transformFromAstSync, traverse } from "@babel/core";

import type { 
  File, Node, Scope, TraverseOptions, 
  NodePath, TransformOptions, ParserOptions, 
  ParseResult 
} from "../types/index.js";


export class BabWrap {
  constructor(readonly parseOpts: ParserOptions) {}

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
  constructor(readonly result: ParseResult<File>) {}

  traverse(options: TraverseOptions, scope?: Scope, parent?: NodePath) {
    traverse(this.result, options, scope, parent);
  }

  convert(opts: TransformOptions) {
    return transformFromAstSync(this.result, undefined, opts);
  }

}