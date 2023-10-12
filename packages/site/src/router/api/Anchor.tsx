
declare const {Elem}: typeof import("@dunes/tag")

export const Anchor: Component<Omit<Elements.Anchor, "onclick"> & {
	href: string
	desc: any
}> = function ({desc, href, ...props}) {

	return (
		<a {...props} href={href} onclick={(e) => {
			e.preventDefault();
			router.visit(href);
		}}>{desc}</a>
	)
}