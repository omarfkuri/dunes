declare global {

	type Many<T> = T | T[]

	type ArrayFn<T> = {
		(array: T[]): void
	}


}
/** Extract item at `n` from `arr`*/
export function extract<T>(arr: T[], n: number): T | undefined {

	let el = arr[n]
	const elAt = arr.length > n;

	for (let i = n; i < arr.length; i++) {
		arr[i] = arr[i+1] as T;
	}

	if (elAt) arr.pop()

		return el;

}

/** Insert item `x` at `n` from `arr`*/
export function insert<T>(arr: T[], n: number, x: T): void {

	const elAt = arr.length > n;
	for (let i = arr.length; i > n-1; i--) {
		arr[i+1] = arr[i] as T;
	}
	if (elAt) arr.pop()

		arr[n] = x;
}


/** Swap item `x` for item `n` in `arr`*/
export function swap<T>(arr: T[], n: number, x: T): T | undefined {

	const el = arr[n];
	arr[n] = x;

	return el;

}

/** Array with more methods */
export class Arr<T> extends Array<T> {

	extract(n: number): T | undefined {
		return extract<T>(this, n)
	}

	insert(n: number, x: T): void {
		return insert<T>(this, n, x);
	}

	swap(n: number, x: T): T | undefined {
		return swap<T>(this, n, x);
	}
}
