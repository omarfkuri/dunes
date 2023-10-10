export { type TransformOptions } from "@babel/core";

export { type NodePath, type Scope, type TraverseOptions } from "@babel/traverse";

export { type File, type Node } from "@babel/types";

export { ParseResult, ParserOptions } from "@babel/parser";

export interface JSXOptions {
  useBuiltIns?: boolean
  useSpread?: boolean
  pragma?: string
  pragmaFrag?: string
  runtime?: "classic" | (string & ({}))
}