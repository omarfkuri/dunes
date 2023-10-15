import type { VerDecl } from "./types.js";




export function verify<const T extends object>(obj: object, ver: VerDecl<T>)
: asserts obj is T {

  for (const key in ver) {
    if (!(key in obj)) {
      throw `Missing property '${key}' in object.`
    }
    const value = obj[key as keyof typeof obj] as T[keyof T];
    const verifier = ver[key];
    
    if (typeof verifier === "string") {
      if (typeof value !== verifier) {
        throw `Value for '${key}' is not '${verifier}'`
      }
    }
    else if (Array.isArray(verifier)) {
      if (!verifier[0].includes(typeof value)) {
        throw `Value for '${key}' is not '${verifier}'`
      }
    }
    else{

      const {type, check, default: def} = verifier;
      const tArr = Array.isArray(type);

      let err = "";

      if (!tArr) {
        if (typeof value !== type) {
          err = `Value for '${key}' is not '${type}'`
        }
      }
      else if (!type[0]!.includes(typeof value)) {
        err = `Value for '${key}' is not '${type}'`
      }

      const result = check(key, value as any);
      if (result !== true) {
        err = result;
      }

      if (err.length) {
        if (def) {
          obj[key as keyof typeof obj] = def as never;
        }
        else {
          throw err;
        }
      }

    }
  }

}