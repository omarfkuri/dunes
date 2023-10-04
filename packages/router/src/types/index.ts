
import "@dunes/tools"
import type { View } from "../class/View"

export interface Director {
	(url: URL): Prom<void>
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
}

export interface Redirect {
	to: string
	// with?: string
}

export type ViewEventRes = Prom<Redirect | void>;

export type ViewProduction = Prom<JSX.Element | Redirect>

export interface ViewConst {
	new(): View
}

export type ViewRevealType = "load" | "reload"