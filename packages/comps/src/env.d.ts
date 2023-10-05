

declare module "*.less" {
	const styles: {
		[key: string]: string
	}
	export default styles;
}

type Styled<
	T extends {[key: string]: any}, 
	S extends {[key: string]: any}
> = (
	Component<T & {css: S}>
)