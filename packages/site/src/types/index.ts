import { Act, Acts, ActsResult, StrResult, StringOpts } from "@dunes/wrap"


export interface SiteBuildConfig {
  /** Output folder */
  out?: Recommend<"out">

  /** Source folder */
  src?: Recommend<"src">

  /** Assets Options */
  assets?: null | {
    /** Assets source folder */
    source: Recommend<"assets">
    /** Assets out folder (leave empty for same as out) */
    out?: string
  }

  /** View Options */
  views?: ViewOptions

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
  file: Recommend<"global.css">
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
  "script"
>;

export type CompileOptions = Omit<
  StringOpts<Acts>,
  "script" | "plugs"
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
  style: boolean
}


export interface WatchOptions {
  onActionStart?(e: WatchEv): Prom<void>
  onActionFinish?(e: WatchEv): Prom<void>
  onActionFailure?(e: WatchEv & {error: unknown}): Prom<void>
}

export type WatchResult = Promise<void>


export interface ProduceOptions {
  origin: string
  hash?: string
  do?: {
    [path: string]: ProducePropsFn
  }
}

export interface ProducePropsFn {
  (path: string): Promise<ProduceProps>
}

export interface ProduceProps {
  path: string
  ids: IDDef[]
}

export interface IDDef {
  id: string
}

export type ProduceResult = Promise<void>


export type CSSResult = ActsResult<[CSSAct]>

export interface CSSAct extends Act {
  name: "css"
  match: any
  action(source: string, id: string): Promise<{
    text: string
    data: {
      text: string
      order: number
    }
  }>
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
