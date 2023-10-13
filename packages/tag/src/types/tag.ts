import type { Comp, Elem } from "../class/Base.js";

export type ThingKind = (
	"content" | "element"
)

export interface Thing {
	kind: ThingKind
	toString(n?: number): string
}


export type Template = TagName | TemplateFunctionParam
export type Properties = null | {
  [key: string]: any
}
export type Descendants = unknown[]

export type TemplateFunctionParam = (
	| TemplateFunction 
	| typeof Comp 
	| typeof Elem
)

export type TemplateFunction = {
	(this: Comp, props: Properties, comp: Comp): JSX.Element
}