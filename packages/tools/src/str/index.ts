
export * from "./slugify.js"
export * from "./Stringify/index.js"
export * from "./transform.js"


declare global {
  type Recommend<T extends string> = T  | (string & {})
}