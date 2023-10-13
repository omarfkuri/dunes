
export type Many<T> = T | T[]

export type ArrayFn<T> = {
  (array: T[]): void
}