import type { DeepPartial } from "../../index.js";
import type { AnyVerifier, Entry, InferType, ObjectVerifierFn, Verifier } from "./types.js";

declare global {
  interface ObjectConstructor {
    entries<T>(x: T): Entry<T>[]
    keys<T>(x: T): (keyof T)[]
    values<T>(x: T): T[keyof T][]
    getOwnPropertyNames<T>(x: T): (keyof T)[]
  }
}

export function verifyItem<T extends any>(x: unknown, t: InferType<T>): x is T {
  if (t === "null") return x === null
  if (t === "array") Array.isArray(x)
  return typeof x === t;
}

export function verifyAny<T extends any>(x: unknown, ...t: InferType<T>[]): x is T {
  return t.some(val => verifyItem(x, val));
}

export function verify<
  X extends {[key: PropertyKey]: any},
  const V extends Verifier<X> = Verifier<X>
>(x: DeepPartial<X>, verifier: V): asserts x is X {

  for (const [name, verVal] of Object.entries(verifier)) {
    verifyVerifier(x[name], name, verVal);
  }
}

export function verifyVerifier<T extends AnyVerifier<any>>(
  value: unknown, 
  name: PropertyKey, 
  verVal: T
) {
  if (typeof verVal === "string") {
    if (!verifyItem(value, verVal)) {
      throw `${String(name)} is not ${verVal}, but ${typeof value}`
    }
  }
  else if (Array.isArray(verVal)) {
    if (!verifyAny(value, ...verVal)) {
      throw `${String(name)} is not ${verVal.join(" | ")}, but ${typeof value}`
    }
  }
  else if (typeof verVal === "function") {
    // @ts-expect-error
    verVal(value as any);
  }
  else if (typeof verVal !== "object") {
    throw `Type ${typeof verVal} cannot be used as a verifier`
  }
  else if (verVal.type === "object") {

    if (typeof value !== "object") {
      throw `Value is not an object`
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
      verify(value as any, verVal.props);
    }
  }
  else {

    if (!Array.isArray(value)) {
      throw `Value is not an array`
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
      for (const item of value as any[]) {
        verifyVerifier(item, name, verVal);
      }
    }
  }
}










// type ObjSetter = {
//   type: Type
//   or?: TypeSetter
//   ver: Verifier
// }

// type TupSetter = [Setter, unknown]

// interface Verifier {
//   <T>(x: T): asserts x is T
// }

// type TypeSetter = Type | Type[]
// type Setter = TypeSetter | ObjSetter | [Setter, unknown]

// type SetterObj = {
//   [key: string]: Setter
// }

// type V<T> = {
//   readonly [K in keyof T]: Setter
// }

// export function verify<T extends SetterObj>(obj: object, ver: T)
// : asserts obj is T {
//   for (const key in ver) {
//     const setter: Setter = ver[key]!;
//     const objValue = obj[key as keyof typeof obj] as unknown;
    
//     if (typeof setter === "string") {
//       if (!isType(objValue, setter)) {
//         throw `Expected ${setter}, got ${typeof objValue}`
//       }
//     }
//     else if (Array.isArray(setter)) {
//       if (setter.every(s => typeof s === "string")) {
//         if (!(setter as Type[]).some(set => isType(objValue, set))) {
//           throw `Expected ${setter.join(" | ")}, got ${typeof objValue}`
//         }
//       }
//       else {
//         const [s, u] = setter as [Setter, unknown];

//       }
//     }
//     else {

//     }
//   }
// }

// export function verifyObj<T extends SetterObj>(obj: object, ver: T)
// : boolean {
//   for (const key in ver) {
//     const setter: Setter = ver[key]!;
//     const objValue = obj[key as keyof typeof obj] as unknown;
    
//     if (typeof setter === "string") {
//       return isType(objValue, setter);
//     }
//     else if (Array.isArray(setter)) {
//       if (setter.every(s => typeof s === "string")) {
//         if (!(setter as Type[]).some(set => isType(objValue, set))) {
//           throw `Expected ${setter.join(" | ")}, got ${typeof objValue}`
//         }
//       }
//       else {
//         const [s, u] = setter as [Setter, unknown];
        
//       }
//     }
//     else {

//     }
//   }
// }

// export function isType<T extends Type>(x: unknown, t: T): boolean {
//   if (t === "null") return x === null
//   if (t === "array") Array.isArray(x)
//   return typeof x === t;
// }
