import type { Prom, Recommend } from "@dunes/tools"
import type { Act, Acts, ActsResult, StrResult, StringOpts } from "@dunes/wrap"
import type { SiteBuilder } from "src/index.js"


export interface BuilderOptions {
  /** Output folder */
  out?: Recommend<"out">

  /** Source folder */
  src?: Recommend<"src">
  
  hash?: string | null


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
}

export type BuildResult = Promise<{
  took: number
}>

interface BaseWatchEv {
  took: number
  style: boolean
}

interface BaseActEv extends BaseWatchEv {
  type: "dependency" | "file"
  name: string
}

interface FileEvent extends BaseActEv {
  type: "file"
}

interface DepEvent extends BaseActEv {
  type: "dependency"
  original: string
  files: Set<string>
}

export type MultiAction = { 
  prom: () => Promise<any>, 
  files: Set<string>
  mod: string
};

interface MultiEv extends BaseWatchEv {
  changes: Map<string, Set<string>>
}

type Err<T> = T & {error: unknown}

type WatchEv = FileEvent | DepEvent

export interface WatchOptions {
  onFileBuilding?(e: WatchEv): Prom<void>
  onFileBuilt?(e: WatchEv): Prom<void>
  onFileFailure?(e: Err<WatchEv>): Prom<void>

  onDepStart?(e: MultiEv): Prom<void>

  onDepBuilding?(e: WatchEv): Prom<void>
  onDepBuilt?(e: WatchEv): Prom<void>
  onDepFailure?(e: Err<WatchEv>): Prom<void>

  onDepFinish?(e: MultiEv): Prom<void>
}

export type WatchResult = Promise<void>


export interface ProduceOptions {
  origin: string
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
  path: string
  builder: SiteBuilder
}

/**
 * Configuration for CLI tool
 * */
export interface BuilderConfig {
  
  /**
   * Builder Options
   * */
  options: BuilderOptions

  /**
   * Build options
   * */
  build?: BuildOptions & {
    inactive?: boolean
  }
  
  /**
   * Produce options
   * */
  produce?: ProduceOptions & {
    inactive?: boolean
  }

  /**
   * Watch for changes
   * */
  watch?: WatchOptions & {
    inactive?: boolean
  }
}