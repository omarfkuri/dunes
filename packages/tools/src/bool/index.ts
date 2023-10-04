
/* Test whether `x` is none */
export function isNone(x: unknown): x is none {
	return x === null || x === undefined || x === false
}

/* Test is function `fn` is a constructor */
export function isConstructor<C extends constructor>(fn: Function): fn is C {
	return String(fn).startsWith("class");
}