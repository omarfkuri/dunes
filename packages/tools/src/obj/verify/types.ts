import type { Many } from "../../index.js"

type BaseType = (
  | "function"
  | "string"
  | "number"
  | "symbol"
  | "boolean"
  | "bigint"
  | "undefined"
  | "function"
  | "object"
)

export type Type = (
  | BaseType

  | "null"
  | "array"
)

export type InferType<T> = (
  T extends Function? "function":
  T extends string ? "string":
  T extends number ? "number":
  T extends symbol ? "symbol":
  T extends boolean ? "boolean":
  T extends bigint ? "bigint":
  T extends undefined ? "undefined":
  T extends null? "null":
  T extends any[]? "array":
  T extends {[key: PropertyKey]: any}? "object":
  Type
)

export type InferResult<T extends Type> = (
  T extends "function"? Function:
  T extends "string"? string :
  T extends "number"? number :
  T extends "symbol"? symbol :
  T extends "boolean"? boolean :
  T extends "bigint"? bigint :
  T extends "undefined"? undefined :
  T extends "null"? null:
  T extends "array"? any[]:
  T extends "object"? {[key: PropertyKey]: any}:
  any
)

export type Entry<T, K extends keyof T = keyof T> = [K, T[K]];

export type VerObj<T> = {
  or?: Many<InferType<T>>
  type: "object" | "array"
}

export type ObjectVerifier<T extends object> = VerObj<T> & {
  type: "object"
} & (
  | { props: Verifier<T> }
  | { test: ObjectVerifierFn<T> }
)

export type ObjectVerifierFn<T extends object> = {
  (entry: Entry<T>, i: number, arr: Entry<T>[]): asserts arr is Entry<T>[]
}



export type ArrayVerifier<T extends any[]> = VerObj<T> & {
  type: "array"
} & (
  | { item: AnyVerifier<T[number]> }
  | { test: ArrayVerifierFn<T> }
)

export type ArrayVerifierFn<T extends any[]> = {
  (item: T[number], i: number, arr: T): asserts arr is T
}



export type Verifier<T> = {
  [K in keyof T]: AnyVerifier<T[K]>;
}

export type AnyVerifier<T> = (
  | Many<InferType<T>>
  | VerifierObjValue<T>
  | VerifierFuncValye<T>
)

export type VerifierObjValue<T> = (
  T extends any[]
  ? ArrayVerifier<T>
  : T extends object
  ? ObjectVerifier<T>
  : never
)

export type VerifierFuncValye<T> = {
  (value: T): asserts value is T
}