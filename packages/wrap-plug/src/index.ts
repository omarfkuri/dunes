
export * from "./types/index.js"
import { localResolve } from "./local-resolve.js"
import { transformInclude } from "./transformInclude.js"

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

