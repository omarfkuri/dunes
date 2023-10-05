




import "@dunes/tools";

export { Form } from "./comp/Form"
export { Classed } from "./factory/Classed"

declare global {
	

	type Styled<
		T extends {[key: string]: any}, 
		S extends {[key: string]: any}
	> = (
		Component<T & {css: S}>
	)
}