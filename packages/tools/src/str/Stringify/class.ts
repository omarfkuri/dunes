import { Descriptor, StringifyConfig } from "./types";


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

    let str = "";

    if (this.config.options?.displayClassName !== false && obj.constructor.name !== "Object") {
      str += obj.constructor.name + this.config.symbol.space
    }

    str += this.config.symbol.openBracket;

    const allKeys = [
      ...Object.getOwnPropertyNames(obj), 
      ...Object.getOwnPropertySymbols(obj)
    ]
    if (!allKeys.length) {
      return str + this.config.symbol.closeBracket
    }
    str += this.config.symbol.break;

    let i = 0;
    const descriptors = Object.getOwnPropertyDescriptors(obj);
    const keys = allKeys
    .map(key => ({
      styled: this.#key(key), 
      descriptor: descriptors[key as keyof typeof descriptors]!
    }))
    .filter((e: {
      styled: string | null
      descriptor: PropertyDescriptor
    }): e is {
      styled: string
      descriptor: PropertyDescriptor
    } => !!e.styled);
    for (const {styled, descriptor} of keys) {
      i++;
      const colon = this.config.options?.excludeColon && typeof descriptor.value === "function"
      ? ""
      : (
        this.config.symbol.colon
        + this.config.symbol.space
      )
      str += (
        this.config.symbol.tab.repeat(depth + 1)
        + styled
        + colon
        + this.#value(descriptor, depth + 1)
        + (i === keys.length? "": this.config.symbol.comma)
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

    let str = "";

    if (this.config.options?.displayClassName !== false &&arr.constructor.name !== "Array") {
      str += arr.constructor.name + this.config.symbol.space
    }

    str += this.config.symbol.openSquare;

    if (!arr.length) {
      return str + this.config.symbol.closeSquare
    }

    str += this.config.symbol.break;

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
        + (i === arr.length? "": this.config.symbol.comma)
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