
export {}

declare global {
  interface ObjectConstructor {
    keys<T>(x: T): (keyof T)[]
    values<T>(x: T): T[keyof T][]
    entries<T>(x: T): [keyof T, T[keyof T]][]
    getOwnPropertyNames<T>(x: T): (keyof T)[]
  }

  
}