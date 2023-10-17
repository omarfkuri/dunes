import type { TraverseOptions } from "@babel/traverse";
import { traverse, type TransformOptions, transformFromAstSync } from "@babel/core";
import parser from "@babel/parser";
import type { File } from "@babel/types";

export class Babs {

  parseOptions: parser.ParserOptions
  defTransformOptions: TransformOptions

  constructor(
    parseOptions: parser.ParserOptions,
    defTransformOptions: TransformOptions = {}
  ) {
    this.parseOptions = parseOptions
    this.defTransformOptions = defTransformOptions
  }

  read(source: string, opts?: parser.ParserOptions) {
    const result = parser.parse(source, {
      ...this.parseOptions,
      ...opts
    })
    return new Bab(this, result);
  }

}

export class Bab {

  constructor(
    private babs: Babs, 
    private result: parser.ParseResult<File>
  ) {}

  traverse(options: TraverseOptions) {
    traverse(this.result, options);
  }

  transform(opts?: TransformOptions) {
    return transformFromAstSync(this.result, undefined, {
      ...this.babs.defTransformOptions,
      ...opts
    })
  }

}