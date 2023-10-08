

type Descriptor<T> = Omit<PropertyDescriptor, "value"> & {value: T}

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

export class Stringify {
  constructor(private config: StringifyConfig) {}

  this(value: unknown): string {
    return this.#value({value}, 0);
  }

  #key(key: PropertyKey): string | null {
    switch(typeof key) {
      case "string": {
        const nk = this.config.style?.key?.string?.(key)
        return nk === null ? null : nk === undefined ? String(key) : nk;
      }
      case "number": {
        const nk = this.config.style?.key?.number?.(key)
        return nk === null ? null : nk === undefined ? String(key) : nk;
      }
      case "symbol": {
        const nk = this.config.style?.key?.symbol?.(key)
        return nk === null ? null : nk === undefined ? String(key) : nk;
      }
    }
  }

  #value(descriptor: PropertyDescriptor, depth: number): string {
    switch(typeof descriptor.value) {
      case "string": return (
        this.config.style?.value?.string?.(descriptor as Descriptor<string>)
        || String(descriptor.value)
      )
      case "number": return (
        this.config.style?.value?.number?.(descriptor as Descriptor<number>)
        || String(descriptor.value)
      )
      case "bigint": return (
        this.config.style?.value?.bigint?.(descriptor as Descriptor<bigint>)
        || String(descriptor.value)
      )
      case "boolean": return (
        this.config.style?.value?.boolean?.(descriptor as Descriptor<boolean>)
        || String(descriptor.value)
      )
      case "symbol": return (
        this.config.style?.value?.symbol?.(descriptor as Descriptor<symbol>)
        || String(descriptor.value)
      )
      case "undefined": return (
        this.config.style?.value?.undefined?.(descriptor as Descriptor<undefined>)
        || String(descriptor.value)
      )
      case "function": return (
        this.config.style?.value?.function?.(descriptor as Descriptor<Function>)
        || String(descriptor.value)
      )
      case "object": {
        if (descriptor.value === null) {
         return (
            this.config.style?.value?.null?.(descriptor as Descriptor<null>)
            || String(descriptor.value)
          )
        }
        if (Array.isArray(descriptor.value)) {
          return this.#arr(descriptor.value, depth);
        }
        return this.#obj(descriptor.value, depth);
      }
    }
  }

  #obj(obj: object, depth: number): string {
    let str = (
      this.config.symbol.openBracket
      + this.config.symbol.break
    );

    let i = 0;
    const descriptors = Object.getOwnPropertyDescriptors(obj);
    const keys = [
      ...Object.getOwnPropertyNames(obj), 
      ...Object.getOwnPropertySymbols(obj)
    ];
    for (const key of keys) {
      const descriptor = descriptors[key as keyof typeof descriptors]!;
      const styledKey = this.#key(key);
      if (!styledKey) 
        continue;
      i++;
      str += (
        this.config.symbol.tab.repeat(depth + 1)
        + styledKey
        + this.config.symbol.colon
        + this.config.symbol.space
        + this.#value(descriptor, depth + 1)
        + (i === descriptors.length? "": this.config.symbol.comma)
        + this.config.symbol.break
      );
    }

    if (depth) {
      str += this.config.symbol.tab.repeat(depth)
    }

    str += this.config.symbol.closeBracket

    return str
  }

  #arr(arr: unknown[], depth: number): string {
    let str = (
      this.config.symbol.openSquare
      + this.config.symbol.break
    );

    let i = 0;
    const descriptors = Object.getOwnPropertyDescriptors(arr);
    for (const key in descriptors) {
      const descriptor = descriptors[key]!;
      if (isNaN(parseFloat(key))) {
        break;
      }
      i++;
      str += (
        this.config.symbol.tab.repeat(depth + 1)
        + this.#value(descriptor, depth + 1)
        + (i === descriptors.length? "": this.config.symbol.comma)
        + this.config.symbol.break
      );
    }

    if (depth) {
      str += this.config.symbol.tab.repeat(depth)
    }

    str += this.config.symbol.closeSquare

    return str
  }


}

export const json = (value: unknown, depth = 2) => {
  return new Stringify({

    symbol: {
      space: " ",
      break: "\n",
      tab: " ".repeat(depth),
      colon: ":",
      comma: ",",
      openSquare: "[",
      closeSquare: "]",
      openBracket: "{",
      closeBracket: "}",
    },

    style: {
      key: {
        string: JSON.stringify,
        number: JSON.stringify,
        symbol(){ return null }
      },
      value: {
        string({value}) {
          return JSON.stringify(value);
        },
        null() {return '"null"'},
        undefined() {return '"undefined"'},
        bigint({value}) {return `"${value}"`},
        function({value}) {
          return `[${value.constructor.name} ${value.name}]`;
        },
      }
    }
  }).this(value)
}