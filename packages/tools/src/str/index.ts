
export * from "./slugify.js"
export * from "./Stringify/index.js"
export * from "./transform.js"
export * from "./types.js"


export function splitLast(str: string, at: string, off = 1): [string, string | undefined] {
  return [
    str.slice(0, str.lastIndexOf(at) + off),
    str.slice(str.lastIndexOf(at) + off, str.length)
  ];
}