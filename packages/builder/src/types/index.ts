
import type { Request, Response } from "express";
import type { Acts, ActsResult, Opts, Act } from "@dunes/wrap";

export type ModuleType = "single" | "sub-multi" | "string"

export type WrapOpts<A extends Acts> = Omit<Opts<A>, "script" | "source">;
export type HanlderWrapOpts<A extends Acts> = Omit<WrapOpts<A>, "plugs">;

export interface BuilderModule {
	type: ModuleType
	globalCSS: string | null
	watch: string[]
}

export interface Config<A extends Acts> {
	src: string
	public: string
	globalCSSFile: string
	handlers: Handlers<A>
	css: CssTrf

	wrap?: (id: string) => WrapOpts<A>

	hash?: string | null

}

export interface CssTrf {
	match: RegExp
	ext: string
	transform(source: string): Promise<string>
}

export interface ServerConfig {
	port: number
	static?: boolean
	api?: (req: Request, res: Response) => Prom<{stop: boolean}>;
}

export interface BuildConfig {
	clean?: boolean

	onBuildStart?: {
		(): Prom<void>
	}

	onBuildFinish?: {
		(took: number): Prom<void>
	}
}

export interface WatchConfig {
	onActionStart?: {
		(event: WatchEvent): Prom<void>
	}
	onActionSuccess?: {
		(event: TimedWatchEvent): Prom<void>
	}
	onActionError?: {
		(event: WatchEventError): Prom<void>
	}
}

export type WatchEvent = OtherWatchEvent | DependencyEvent;

export interface BaseWatchEvent {
	filename: string
	style: boolean
	type: ModuleType | "dependency"
}

export interface OtherWatchEvent extends BaseWatchEvent {
	type: ModuleType
}

export interface DependencyEvent extends BaseWatchEvent {
	parents: string[]
	type: "dependency"
}

export type TimedWatchEvent = WatchEvent & {
	took: number
}

export type WatchEventError = TimedWatchEvent & {
	error: unknown
}

export type Handlers<A extends Acts> = readonly Handler<A>[]

export interface ProcessInfo<A extends Acts> {
	modules: string[]
	hash: null | string
	results: ActsResult<A>
  id: string
  source: string
}

export interface Processor<A extends Acts> {
	(script: string, info: ProcessInfo<A>): Prom<string>
}

export interface BaseHandler<A extends Acts> {
	opt?: HanlderWrapOpts<A>
	process?: Processor<A>
	defer?: number
}

export interface SingleHandler<A extends Acts> extends BaseHandler<A> {
	entry: string
	outStylesFile?: string
	outFile: string
}

export interface ReadHandler<A extends Acts> extends BaseHandler<A> {
	string: string
	fakeName: string
	outStylesFile?: string
	outFile: string
}

export type MultiHandler<A extends Acts> = BaseHandler<A> & {
	match: RegExp
	subDir: string
} & (
	| {outDir: string}
	| {outFile: string}
) & (
	| {outStylesDir?: string}
	| {outStylesFile?: string}
)

export type Handler<A extends Acts> = (
	| SingleHandler<A> 
	| MultiHandler<A> 
	| ReadHandler<A>
)


export interface InternalBuildResult {
	string: string
	watch: string[]
	result: ActsResult<Acts>
}

export type CSSResult = ActsResult<[CSSAct]>

export interface CSSAct extends Act {
	name: "css", 
	match: any, 
	action(): {
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

export interface HanlderHandler<A extends Acts> {
	sub(handler: MultiHandler<A>): Prom<any>
	sin(handler: SingleHandler<A>): Prom<any>
	str(handler: ReadHandler<A>): Prom<any>
}

export interface NamedHandlerHandler<A extends Acts> {
	sub(name: string, handler: MultiHandler<A>): Prom<any>
	sin(name: string, handler: SingleHandler<A>): Prom<any>
	str(name: string, handler: ReadHandler<A>): Prom<any>
}