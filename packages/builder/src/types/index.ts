
import type { Request, Response } from "express";
import type { Acts, ActsResult, Opts, Act } from "@dunes/wrap";

export type ModuleType = "single" | "sub-multi"

export type WrapOpts<A extends Acts> = Omit<Opts<A>, "script" | "source">;
export type HanlderWrapOpts<A extends Acts> = Omit<WrapOpts<A>, "plugs">;

export interface BuilderModule {
	type: ModuleType
	globalCSS: string | null
	source: string
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
	transform(source: string): Promise<string>
}

export interface ServerConfig {
	port: number
	static?: boolean
	api?: (req: Request, res: Response) => Prom<{stop: boolean}>;
}

export interface BuildConfig {
	clean?: number
}

export interface WatchConfig {
	onActionStart?: {
		(event: WatchEvent): Prom<any>
	}
	onActionSuccess?: {
		(event: TimedWatchEvent): Prom<any>
	}
	onActionError?: {
		(event: WatchEventError): Prom<any>
	}
}

export interface WatchEvent {
	filename: string
	style: boolean
	type: ModuleType
}

export interface TimedWatchEvent extends WatchEvent {
	took: number
}

export interface WatchEventError extends TimedWatchEvent {
	error: unknown
}

export type Handlers<A extends Acts> = readonly Handler<A>[]

export interface Info<A extends Acts> {
	modules: string[]
	hash: null | string
	results: ActsResult<A>
}

export interface Processor<A extends Acts> {
	(script: string, info: Info<A>): Prom<string>
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
	match: RegExp | string
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