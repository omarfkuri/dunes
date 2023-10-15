import type { Many } from "@dunes/tools"

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

export type VerifierDecl<X extends {[key: PropertyKey]: any}> = {
  [K in keyof X]: Verifier<X[K]>
}

export type Verifier<X> = Many<(
  | Type
  | (X extends object? ObjVer<X>: never)
  | (X extends any[]? ArrVer<X>: never)
  | FunVer<X>
)>

export type FunVer<X> = (value: X, path: string) => asserts value is X;

export type ArrVer<X extends any[]> = {
  item: Verifier<X[number]>
}

export type ObjVer<X extends object> = {
  prop: VerifierDecl<X>
}

export type VerRes = (
  {
    ok: true
  }
  |
  {
    ok: false
    error: string
  }
)