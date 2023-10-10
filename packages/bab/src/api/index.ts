import { JSXOptions, TSOptions, Plug } from "../types";





export function jsxPlugin(opts: JSXOptions): Plug {
  return ["@babel/preset-react", opts];
}

export function tsPlugin(opts: TSOptions): Plug {
  return ["@babel/preset-typescript", opts];
}