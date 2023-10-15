
type Type = (
  | "function"
  | "string"
  | "number"
  | "symbol"
  | "boolean"
  | "bigint"
  | "undefined"
  | "function"
  | "object"
  
  | "null"
)

type ArrSetter = {
  type: "array"
  or?: TypeSetter
  items: Setter
}

type ObjSetter = {
  type: "object"
  or?: TypeSetter
  props: SetterObj
}

type TypeSetter = Type | Type[]
type Setter = TypeSetter | ObjSetter | ArrSetter

type SetterObj = {
  [key: string]: Setter
}

type V<T> = {
  readonly [K in keyof T]: Setter
}

export function verify<T extends object>(obj: object, ver: V<T>)
: asserts obj is T {
  for (const key in ver) {
    const setter: Setter = ver[key];
    const objValue = obj[key as keyof typeof obj] as unknown;
    verifyValue(key, objValue, setter);
  }
}

function verifyValue<T>(key: string | number, val: unknown, set: Setter)
: asserts val is T {
  if (Array.isArray(set)) {
    if (!set.includes(typeof val) || (set.includes("null") && val !== null)) {
      throw new VerifyError(key, set.join(" | "), val)
    }
  }
  else if (typeof set === "object") {
    if (set.type === "object") {
      if (!val || typeof val !== "object") {
        if (set.or) {
          verifyValue(key, val, set.or);
          return;
        }
        else 
          throw new VerifyError(key, "object", val)
      }
      verify(val, set.props);
    }
    else {
      if (!Array.isArray(val)) {
        if (set.or) {
          verifyValue(key, val, set.or);
          return;
        }
        else 
          throw new VerifyError(key, "array", val)
      }
      let i = 0;
      for (const item of val) {
        verifyValue(i, item, set.items);
      }
    }

  }
  else if (typeof val !== set && (set !== "null" && val !== null)) {
    
    throw new VerifyError(key, set, val)
  }
}

class VerifyError extends Error {

  constructor(key: string | number, type: string, val: unknown) {
    super(`Value for '${key}' is ${typeof val}. Expected ${type}.`);
  }
}