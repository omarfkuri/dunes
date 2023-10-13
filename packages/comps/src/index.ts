




import "@dunes/tools";

export * from "./comp/Form.js"
export * from "./factory/Classed.js"

export type Styled<
  T extends {[key: string]: any}, 
  S extends {[key: string]: any}
> = (
  Component<T & {css: S}>
)