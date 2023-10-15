import "@dunes/types";
import type { DeepPartial } from "@dunes/tools";

import type { InferType, VerRes, Verifier, VerifierDecl,  } from "./types.js";

/**
 * Asserts that variable `obj` is object `X`
 * */
export function verify<X extends object>(
  obj: DeepPartial<X>,
  ver: VerifierDecl<X>,
  parent: string | null = null
): asserts obj is X {
  for (const prop in ver) {
    const value = obj[prop]!;
    const verifier = ver[prop]!;

    const res = checkVerifier(prop, value, verifier, parent);
    if (!res.ok) {
      throw res.error;
    }
  }
}

/**
 * Asserts that variable `x` is of type `T`
 * */
export function isType<T extends any>(
  x: unknown, 
  t: InferType<T>,
): x is T {
  if (t === "null") return x === null
  if (t === "array") Array.isArray(x)
  return typeof x === t;
}

function checkVerifier(
  prop: PropertyKey,
  value: any,
  verifier: Verifier<any>,
  parent: string | null
): VerRes
{
  const path = ((parent !== null) ? (
    typeof prop === "string"
    ? `${parent}.`
    : `${parent}[`
    ) : "") + String(prop) + (
    typeof prop === "string"? "": "]"
  );

  if (typeof verifier === "string") {
    if (!isType(value, verifier)) {
      return {
        ok: false,
        error: `Prop '${path}' is ${typeof value}. Expected ${verifier}.`
      }
    }
  }

  else if (typeof verifier === "function") {
    // @ts-expect-errors
    verifier(value, path);
  }

  else if (typeof verifier !== "object") {
    return {
      ok: false,
      error: `Unexpected verifier type ${typeof verifier}.`
    }
  }
  
  else if (Array.isArray(verifier)) {
    let pass = false;
    const errors: string[] = []
    for (const veri of verifier) {
      const result = checkVerifier(prop, value, veri, parent);
      if (result.ok) {
        pass = true;
      }
      else {
        errors.push(result.error);
      }
    }

    if (!pass) {
      return {
        ok: false,
        error: `${errors.length} errors occurred.`
      }
    }
  }
  else if ("prop" in verifier) {
    if (!value || Array.isArray(value)) {
      return {
        ok: false,
        error: `Prop '${path}' is ${typeof value}. Expected object.`
      }
    }
    verify(value, verifier.prop, path)
  }
  
  else if ("item" in verifier) {
    if (!value || !Array.isArray(value)) {
      return {
        ok: false,
        error: `Prop '${path}' is ${typeof value}. Expected array.`
      }
    }
    let i = 0;
    for (const item of value) {
      checkVerifier(i, item, verifier.item, path)
      i++;
    }
  }

  return {
    ok: true
  }
}