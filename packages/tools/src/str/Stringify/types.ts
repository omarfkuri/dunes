
export type Descriptor<T> = Omit<PropertyDescriptor, "value"> & {value: T}

export interface StringifyConfig {

  symbol: {
    space: string
    break: string
    tab: string
    colon: string
    comma: string

    openSquare: string
    closeSquare: string

    openBracket: string
    closeBracket: string
  }

  options?: {
    displayClassName?: boolean
    excludeColon?: "never" | "function"
  }

  style?: {

    key?: {
      string?(str: string): string | null
      number?(num: number): string | null
      symbol?(sym: symbol): string | null
    }

    value?: {
      string?(str: Descriptor<string>): string
      number?(num: Descriptor<number>): string
      symbol?(sym: Descriptor<symbol>): string
      bigint?(sym: Descriptor<bigint>): string
      null?(nul: Descriptor<null>): string
      boolean?(boo: Descriptor<boolean>): string
      undefined?(und: Descriptor<undefined>): string
      function?(fun: Descriptor<Function>): string
    }
  }
}