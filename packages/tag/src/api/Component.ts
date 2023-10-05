import { Comp } from "../class/Base"



export function Component<T extends obj = {}>(comp: Component<T>) {
	return comp;
}



declare global {

	type Component<T extends {[key: string]: any} = {}> = {
		(this: Comp<T>, props: T, comp: Comp<T>): JSX.Element
	}
}