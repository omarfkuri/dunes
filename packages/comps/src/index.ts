




import "@dunes/tools";

export * from "./comp/Form"
export * from "./factory/Classed"

declare global {
	

	type Styled<
		T extends {[key: string]: any}, 
		S extends {[key: string]: any}
	> = (
		Component<T & {css: S}>
	)
}