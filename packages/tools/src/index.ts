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

export {
	
	extract,
	insert,
	swap,
	Arr,

} from "./array"
export {

	isConstructor,
	isNone,

} from "./bool"
export {

  Stringify,
  json,
  js

} from "./str"

export function sleep(ms = 5000) {
  return new Promise<void>(res => setTimeout(res, ms));
}