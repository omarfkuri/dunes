
import "@dunes/tools"
import type { View } from "../class/View.js"
import type { Comp } from "@dunes/tag"
import type { Prom, obj } from "@dunes/tools"

export interface Director {
	(url: URL, req: URL): Prom<void>
}

export interface RouterConfig {
	hash: null | string
	pages: string[]
	direct: Director
	views: {
		folder: string
		home: string
		error: string
	}
	root: string
	rootStyles: string
  reveal?: Reveal
}

export interface Redirect {
	to: string
	// with?: string
}

export type ViewEventRes = Prom<Redirect | void>;

export type ViewProduction<Props extends obj> = Comp<Props>

export interface ViewConst {
	new(): View
	stylesRef: string
}

export type ViewRevealType = "load" | "reload"


export interface Reveal {
  rememberScroll?: boolean
  
}