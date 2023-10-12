import { ParserOptions, TransformOptions, TraverseOptions } from "@dunes/bab"

export interface ResolveOptions {
  id: string
  keeps: Set<string>
  parseOptions: ParserOptions
  transformOptions: (id: string) => TransformOptions
  traverseOptions?: TraverseOptions
  resolveIncludes?: boolean
}