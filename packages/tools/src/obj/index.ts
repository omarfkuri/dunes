
export * from "./verify/index.js"

export function getKeys<X>(obj: X): (keyof X)[] {
  return [
    ...Object.getOwnPropertyNames(obj), 
    ...Object.getOwnPropertySymbols(obj)
  ] as (keyof X)[]
}