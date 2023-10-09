
export type Infer<T> = (
  T extends string? "string":
  T extends number? "number": 
  T extends symbol? "symbol": 
  T extends boolean? "boolean": 
  T extends bigint? "bigint": 
  T extends undefined? "undefined": 
  T extends null? "null": 
  T extends Function? "function": 
  T extends any[]? "array": 
  T extends object? "object": 
  never
)


export type VerDecl<T> = {
  [K in keyof T]: (
    | Infer<T[K]> 
    | [Infer<T[K]>, T]
    | VerObj<T, K>
  )
}

export type VerObj<T, K extends keyof T> = {
  type: Many<Infer<T[K]>>
  check(key: K, value: T[K]): true | string
  default?: T[K]
}
