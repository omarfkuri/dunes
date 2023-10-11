
/* Test whether `x` is none */
export function isNone(x: unknown): x is none {
	return x === null || x === undefined || x === false
}

/* Test is function `fn` is a constructor */
export function isConstructor<C extends constructor>(fn: Function): fn is C {
	return String(fn).startsWith("class");
}

/* Test is function `fn` is an arrow fn */
export function isNamed(fn: Function): fn is Function {
  return String(fn).startsWith("function")
  || String(fn).startsWith("async function");
}

/* Test is function `fn` is an async fn */
export function isAsync<P extends {(...args: any[]): Promise<any>}>(fn: Function): fn is P {
  return String(fn).startsWith("async");
}

