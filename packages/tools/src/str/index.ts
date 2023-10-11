
export * from "./slugify"
export * from "./Stringify"
export * from "./transform"


declare global {
  type Recommend<T extends string> = T  | (string & {})
}