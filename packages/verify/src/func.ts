import "@dunes/types";
import type { DeepPartial } from "@dunes/tools";
import type { AnyVerifier, InferType, Verifier } from "./types.js";


export function verify<
  X extends {[key: PropertyKey]: any},
  const V extends Verifier<X> = Verifier<X>>(
  x: DeepPartial<X>, 
  verifier: V,
  parent: PropertyKey | null = null
): asserts x is X {

  for (const [name, verVal] of Object.entries(verifier)) {
    switchVerifier(x[name], name, verVal, parent);
  }
}

function verifyValue<T extends any>(
  x: unknown, 
  t: InferType<T>,
): x is T {
  if (t === "null") return x === null
  if (t === "array") Array.isArray(x)
  return typeof x === t;
}

function switchVerifier<T extends AnyVerifier<any>>(
  value: unknown, 
  name: PropertyKey, 
  verVal: T,
  parentIn: PropertyKey | null
) {
  const nameStr = typeof name === "string";
  const parent = (parentIn? (
    String(parentIn) + (nameStr? ".": "[")
  ): "") + String(name) + (nameStr? "": "]");

  if (typeof verVal === "string") {
    if (!verifyValue(value, verVal)) {
      throw new VerifierError(
        `Property '${String(name)}' is ${typeof value}. Expected ${verVal}.`,
        parentIn
      )
    }
  }
  else if (Array.isArray(verVal)) {
    if (!verVal.some(val => verifyValue(value, val))) {
      throw new VerifierError(
        `Property '${String(name)}' is ${typeof value}. Expected ${verVal.join(" | ")}.`,
        parentIn
      )
    }
  }
  else if (typeof verVal === "function") {
    // @ts-expect-error
    verVal(value as any);
  }
  else if (typeof verVal !== "object") {
    throw new VerifierError(
      `Type ${typeof verVal} cannot be used to verify '${String(name)}'`,
      parentIn
    )
  }
  else if (verVal.type === "object") {

    if (!value || typeof value !== "object") {
      throw new VerifierError(
        `Value for '${String(name)}' is not an object`,
        parentIn
      )
    }

    if ("test" in verVal) {
      let i = 0;
      const entries = Object.entries(value);
      for (const entry of entries) {
        // @ts-expect-error
        verVal.test(entry, i, entries);
        i++
      }
    }

    else {
      verify(value as any, verVal.props, parent);
    }
  }
  else {

    if (!value || !Array.isArray(value)) {
      throw new VerifierError(
        `Value for '${String(name)}' is not an array`,
        parentIn
      )
    }

    if ("test" in verVal) {
      let i = 0;
      for (const item of value as any[]) {
        // @ts-expect-error
        verVal.test(item, i, value);
        i++
      }
    }

    else {
      let i = 0;
      for (const item of value as any[]) {
        switchVerifier(item, i, verVal.item, parent);
        i++
      }
    }
  }
}

class VerifierError extends Error {

  constructor(message: string, parent: PropertyKey | null) {
    super("@ " + String(parent) +  "\n" + message);
  }
}