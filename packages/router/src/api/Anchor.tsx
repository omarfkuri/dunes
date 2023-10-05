
declare const {Elem}: typeof import("@dunes/tag")

export const Anchor: Component<Omit<Elements.Anchor, "onclick"> & {
	href: string
	desc: any
}> = function ({desc, ...props}) {

	return (
		<a {...props} onclick={(e) => {
			e.preventDefault();
			return router.go(e.target.href);
		}}>{desc}</a>
	)
}