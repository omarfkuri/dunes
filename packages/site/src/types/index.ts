import { Act, Acts, ActsResult, StrResult, StringOpts } from "@dunes/wrap"


export interface SiteBuildConfig {
  /** Output folder */
  out?: Recommend<"out">

  /** Source folder */
  src?: Recommend<"src">

  /** View Options */
  views?: ViewOptions

  /** Temp Options */
  htmlLib?: string
  /** Temp Options */
  htmlBody?: string

  /** CSS Options */
  css?: CSSOptions

  /** Wrap Options */
  wrap?: WrapOptions
  /** 
   * # Libraries script 
   * 
   * Export any libraries used in the app,
   * declare global types to avoid importing
   * them in every file
   * 
   * */
  
  lib?: Recommend<"lib.ts">
  /** 
   * # Main script 
   * 
   * Included in every page
   * 
   * */
  
  main?: Recommend<"main.ts">
  /** 
   * # Base HTML
   * 
   * The template for every view
   * 
   * */
  base?: Recommend<"base.tsx">
}

export interface CSSOptions {
  /** 
   * Match files included
   * */
  match: RegExp 
  ext: string
  transform(source: string): Prom<string>

}

export interface ViewOptions {
  /** 
   * # View folder 
   * Declare pages here
   * */
  folder: Recommend<"views">
  /** 
   * Match files included
   * */
  only: RegExp
}

export type WrapOptions = Omit<
  StringOpts<Acts>,
  "script" | "transform"
>;

export type CompileOptions = Omit<
  StringOpts<Acts>,
  "script" | "transform" | "plugs"
>;

export type CompileResult = StrResult<readonly [CSSAct]>;


export type ModuleMap = Map<string, CompileResult>;


export interface BuildOptions {
  clean?: boolean
  hash?: string
}

export type BuildResult = Promise<{
  took: number
}>

interface WatchEv {
  type: "dependency" | "file"
  name: string
  original?: string
  files?: Set<string>
  took: number
}

export interface WatchOptions {
  onActionStart?(e: WatchEv): Prom<void>
  onActionFinish?(e: WatchEv): Prom<void>
  onActionFailure?(e: WatchEv & {error: unknown}): Prom<void>
}

export type WatchResult = Promise<void>


export type CSSResult = ActsResult<[CSSAct]>

export interface CSSAct extends Act {
  name: "css", 
  match: any, 
  action(source: string, id: string): {
    text: string
    data: {
      text: string
      order: number
    }
  }
}

export interface CSSAnalysis {
  exports: string
  css: string
}

export interface HTMLFunction {
  (e: HTMLFunctionEvent): Prom<string>
}

export interface HTMLFunctionEvent {
  scripts: string[]
  styles: string[]
  body: string
}
export interface Redirect {
  to: string
  with?: string
}

export type ViewEventRes = Prom<Redirect | void>;

export type ViewRevealType = "load" | "reload"