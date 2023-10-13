

export * from "./array/index.js"
export * from "./bool/index.js"
export * from "./str/index.js"
export * from "./obj/index.js"

export * from "./unicode/index.js"
export * from "./extra.js"

declare global {
	type obj = {
		[key: PropertyKey]: unknown
	}

	type none = undefined | null | false

	type constructor = {
		new (...args: any[]): any
	}

	type prototype<T, P extends any[] = any[]> = {
		new (...args: P): T
		prototype: T
	}

	type prim = (
		| string
		| number
		| boolean
		| bigint
	)

	type Prom<T> = T | Promise<T>;

}