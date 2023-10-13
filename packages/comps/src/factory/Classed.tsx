import { Component } from "@dunes/tag"
declare const Elem: typeof import("@dunes/tag").Elem


export function Classed<T extends {[key: string]: any}>(
	glob: string,
	Co: Component<T & {cl?: string}>
) {
	return Component<T & {cl?: string}>((props) => {
		if (props.cl) {
			props.cl = glob + " " + props.cl
		}
		else {
			props.cl = glob
		}
		return <Co {...props}/>;
	});
}