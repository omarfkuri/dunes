import "@dunes/types";
import type { InferType, Type,  } from "./types.js";
import type { DeepPartial, Many } from "@dunes/tools";


type VerifierDecl<X extends {[key: PropertyKey]: any}> = {
  [K in keyof X]: Verifier<X[K]>
}

type Verifier<X> = Many<(
  | Type
  | (X extends object? ObjVer<X>: never)
  | (X extends any[]? ArrVer<X>: never)
  | FunVer<X>
)>

type FunVer<X> = (value: X, path: string) => asserts value is X;

type ArrVer<X extends any[]> = {
  item: Verifier<X[number]>
}

type ObjVer<X extends object> = {
  prop: VerifierDecl<X>
}

type VerRes = (
  {
    ok: true
  }
  |
  {
    ok: false
    error: string
  }
)

export function verify<X extends object>(
  obj: DeepPartial<X>,
  ver: VerifierDecl<X>,
  parent: string | null = null
): asserts obj is X {
  for (const prop in ver) {
    const value = obj[prop]!;
    const verifier = ver[prop]!;

    const res = verifyType(prop, value, verifier, parent);
    if (!res.ok) {
      throw res.error;
    }
    
  }
}

function verifyType(
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
    if (!verifyValue(value, verifier)) {
      return {
        ok: false,
        error: `Prop '${path}' is ${typeof value}. Expected ${verifier}`
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
      error: `Unexpected verifier type ${typeof verifier}`
    }
  }
  
  else if (Array.isArray(verifier)) {
    let pass = false;
    const errors: string[] = []
    for (const veri of verifier) {
      const result = verifyType(prop, value, veri, parent);
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
        error: `${errors.length} errors occurred`
      }
    }
  }
  else if ("prop" in verifier) {
    verify(value, verifier.prop, path)
  }
  
  else if ("item" in verifier) {
    if (!Array.isArray(value)) {
      throw ""
    }
    let i = 0;
    for (const item of value) {
      verifyType(i, item, verifier.item, path)
      i++;
    }
  }

  return {
    ok: true
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