import "@dunes/tools"
import {
  Options
} from "@dunes/bab"

export interface BabelOptions {
  jsx?: JSXOptions
  id: string
  ts?: {[key: string]: any}
  keeps: Set<string>
}

export interface JSXOptions {
  useBuiltIns?: boolean
  useSpread?: boolean
  pragma?: string
  pragmaFrag?: string
  runtime?: "classic" | (string & ({}))
}

export interface ResolveOptions {
  id: string
  keeps: Set<string>
  parseOptions: Parse
}