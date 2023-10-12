
export * from "./types"
import { localResolve } from "./local-resolve"
import { transformInclude } from "./transformInclude"

export { 
  localResolve as default, 
  localResolve,
  transformInclude,
  include
}

function include<T, X>(
  mod: Promise<T>,
  use: (obj: T) => X
): X {
  throw "Include call was not removed..."
}

