
import type { Prom } from "@dunes/tools"
import type { RollupNodeResolveOptions } from "@rollup/plugin-node-resolve"
import type { OutputOptions } from "rollup"
import type { Bundler } from "./Bundler.js"
import type { JSXOptions, TSOptions, Bab, BabWrap } from "@dunes/bab"

export interface BundlerConfig {
  jsx?: JSXOptions | false
  ts?: TSOptions | false
  resolve?: RollupNodeResolveOptions
  treeshake?: boolean
  output?: OutputOptions

  /**
   * Runs before every file
   * */
  onLoad?: OnLoad

  /**
   * Runs after every parse
   * */
  onParse?: OnParse

  /**
   * Runs after transform concludes
   * */
  onResult?: OnResult
  

  /**
   * Runs on code result
   * */
  onConclude?: OnConclude

}

export interface OnLoad {
  (event: LoadEvent): Prom<CodeTrfResult>
}

export interface OnParse {
  (event: ParseEvent): Prom<void>
}

export interface OnResult {
  (event: ResultEvent): Prom<CodeTrfResult>
}

export interface OnConclude {
  (event: ConcludeEvent): Prom<string>
}

export interface BundleEvent {
  filename: string
  bundler: Bundler
}

export interface LoadEvent extends BundleEvent {
  source: string
}

export interface ParseEvent extends BundleEvent {
  bab: Bab
  babel: BabWrap
}

export interface ResultEvent extends BundleEvent {
  code: string
}

export interface ConcludeEvent extends BundleEvent {
  code: string
}

type CodeTrfResult = void | {
  stop?: boolean
  text: string | null
}