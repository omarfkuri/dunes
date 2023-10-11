
export {
  slugify
} from "./slugify"
export {
  Stringify,
  js,
  json
} from "./Stringify"
export {
  capitalize
} from "./transform"


declare global {
  type Recommend<T extends string> = T  | (string & {})
}