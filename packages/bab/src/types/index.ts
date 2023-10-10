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

export type Plug = [string, object]

export interface TSOptions {
  /**
   * Forcibly enables jsx parsing. Otherwise angle brackets will be treated
   * as typescript's legacy type assertion `var foo = <string>bar;`. 
   * Also, `isTSX: true` requires `allExtensions: true`.
   * */
  isTSX?: boolean
  /**
   * Replace the function used when compiling JSX expressions. This is
   * so that we know that the import is not a type import, and should 
   * not be removed.
   * */
  jsxPragma?: string
  /**
   * Replace the function used when compiling JSX fragment expressions. This
   * is so that we know that the import is not a type import, and 
   * should not be removed.
   * */
  jsxPragmaFrag?: string

  /**
   * Indicates that every file should be parsed as TS, TSX, or as TS without JSX 
   * ambiguities (depending on the isTSX and disallowAmbiguousJSXLike options).
   * */
  allExtensions?: boolean

  /**
   * Enables compilation of TypeScript namespaces.
   * */
  allowNamespaces?: boolean

  /**
   * NOTE: This will be enabled by default in Babel 8
   * When enabled, type-only class fields are only removed if they are 
   * prefixed with the declare modifier:
   * */
  allowDeclareFields?: boolean

  /**
   * Even when JSX parsing is not enabled, this option disallows using 
   * syntax that would be ambiguous with JSX 
   * (<X> y type assertions and <X>() => {} type arguments). 
   * It matches the tsc behavior when parsing .mts and .mjs files.
   * */
  disallowAmbiguousJSXLike?: boolean

  /**
   * When set to true, the transform will only remove type-only imports 
   * (introduced in TypeScript 3.8). This should only be used if 
   * you are using TypeScript >= 3.8.
   * */
  onlyRemoveTypeImports?: boolean

  /**
   * When set to true, Babel will inline enum values rather 
   * than using the usual enum output
   * ```typescript
   * // Input
   * const enum Animals {
   *   Fish
   * }
   * console.log(Animals.Fish);
   * 
   * // Default output
   * var Animals;
   * 
   * (function (Animals) {
   *   Animals[Animals["Fish"] = 0] = "Fish";
   * })(Animals || (Animals = {}));
   * 
   * console.log(Animals.Fish);
   * 
   * // `optimizeConstEnums` output
   * console.log(0);
   * 
   * This option differs from TypeScript's --isolatedModules behavior, which ignores the const modifier and compiles them as normal enums, and aligns Babel's behavior with TypeScript's default behavior.
   * 
   * However, when exporting a const enum Babel will compile it to a plain object literal so that it doesn't need to rely on cross-file analysis when compiling it:
   * 
   * // Input
   * export const enum Animals {
   *   Fish,
   * }
   * 
   * // `optimizeConstEnums` output
   * export var Animals = {
   *   Fish: 0,
   * };
   * ```
   * */
  optimizeConstEnums?: boolean

  /**
   * When set to true, Babel will rewrite .ts/.mts/.cts extensions 
   * in import declarations to .js/.mjs/.cjs.
   * This option, when used together with TypeScript's allowImportingTsExtension 
   * option, allows to write complete relative specifiers in import declarations 
   * while using the same extension used by the source files.
   * */
  rewriteImportExtensions?: boolean
}