import "@dunes/tools"

import { Plugin } from 'rollup';

import type { OutputOptions, RollupOptions } from 'rollup';

export interface BaseOpts<A extends Acts> {
	treeshake?: RollupOptions["treeshake"]
	format?: OutputOptions["format"]
	plugs?: Plugin<any>[]
	transform?: A
	replaceBefore?: Replacer[]
	replaceAfter?: Replacer[]
}

export type Replacer = [RegExp | string, string];
export type ReplacerMatch = RegExp | string
export type ReplacerValue = string | {
	(substr: string, ...args: any[]): string
};

export interface StringOpts<A extends Acts> extends BaseOpts<A> {
	script: string
}

export interface FileOpts<A extends Acts> extends BaseOpts<A> {
	source: string
}

export type Opts<A extends Acts> = StringOpts<A> | FileOpts<A>

export interface Act {
	name: string
	match: RegExp
	action(source: string, id: string): Prom<{
		data?: any
		text: string | false
	}>
}

export type Acts = readonly Act[]

export type ActsResult<A extends Acts> = {
	[K in A[number]["name"]]: Awaited<ReturnType<Extract<A[number], {name: K}>["action"]>>["data"][]
} 


export type Result<A extends Acts> = {
	watch: string[]
	result: ActsResult<A>
}

export type StrResult<A extends Acts> = Result<A> & {
	code: string
}


export interface BabelOptions {
	jsx?: JSXOptions
	id: string
	ts?: {[key: string]: any}
}

export interface JSXOptions {
	useBuiltIns?: boolean
	useSpread?: boolean
	pragma?: string
	pragmaFrag?: string
	runtime?: "classic" | (string & ({}))
}