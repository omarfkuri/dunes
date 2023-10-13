
import type { Prom } from "@dunes/tools";

import type { Plugin } from 'rollup';

import type { OutputOptions, RollupOptions } from 'rollup';

export type { Plugin }

export interface BaseOpts<A extends Acts> {
	treeshake?: RollupOptions["treeshake"]
	format?: OutputOptions["format"]
	plugs?: Plugin<any>[]
	transform?: A
	replaceBefore?: Replacer[]
	replaceAfter?: Replacer[]
  outFile?: string
}

export type Replacer = [ReplacerMatch, ReplacerValue];
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

export interface Act<X = unknown> {
	name: string
	match: RegExp
  prep?(wrapOptions: Opts<Acts>): X
	action(source: string, id: string, wrapOptions: Opts<Acts>, prep: X): Prom<{
		data?: any
		text: string | false
	}>
}

export type Acts<X = unknown> = readonly Act<X>[]

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