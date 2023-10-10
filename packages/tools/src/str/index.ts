
export * from "./Stringify"


export function capitalize(str: string): string {
  return str[0]!.toUpperCase() + str.slice(1).toLowerCase();
}


declare global {
  type Recommend<T extends string> = T  | (string & {})
}