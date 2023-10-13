import type { Comp } from "../class/Base.js"



export function Component<T extends {[key: string]: any} = {}>(comp: Component<T>) {
	return comp;
}



declare global {

	type Component<T extends {[key: string]: any} = {}> = {
		(this: Comp<T>, props: T, comp: Comp<T>): JSX.Element
	}
}