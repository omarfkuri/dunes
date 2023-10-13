import type { JSXOptions, TSOptions, Plug } from "../types/index.js";





export function jsxPreset(opts: JSXOptions): Plug {
  return ["@babel/preset-react", opts];
}

export function tsPreset(opts: TSOptions): Plug {
  return ["@babel/preset-typescript", opts];
}