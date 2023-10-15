import type { RecommendKey } from "../index.js";

interface Affector<
  K extends PropertyKey, 
  T extends any, 
  K2 extends PropertyKey,
  T2 extends any, 
> {
  (entry: [K, T], i: number, entries: [K, T][]): [K2, T2]
}

export function affect<
  K extends PropertyKey, 
  T extends any, 
  K2 extends PropertyKey,
  T2 extends any, 
>(
  original: {[key in K]: T},
  affector: Affector<K, T, K2, T2>
): {[key in K2]: T2} {
  return Object.fromEntries(
    Object.entries(original).map(affector as any) as any
  ) as {[key in K2]: T2}
}



export class Obj<K extends PropertyKey, T extends any> {
  constructor(readonly original: {[key in K]: T}) {}

  values(): T[] {
    return Object.values(this.original);
  }

  keys(): K[] {
    return Object.keys(this.original) as K[];
  }

  entries(): [K, T][] {
    return Object.entries(this.original) as [K, T][];
  }

  get(key: RecommendKey<K>): T | null {
    return this.original[key as K] || null;
  }

  has<k extends RecommendKey<K>>(key: k): this is Obj<K | k, T> {
    return key in this.original;
  }

  set(key: RecommendKey<keyof T>, value: T): void {
    this.original[key as K] = value;
  }

  affect<K2 extends PropertyKey, T2>(affector: Affector<K, T, K2, T2>): Obj<K2, T2> {
    return new Obj(affect(this.original, affector));
  }

  static from<K extends PropertyKey, T>(entries: [K, T][]): Obj<K, T> {
    return new Obj(Object.fromEntries(entries) as {[key in K]: T});
  }

  *[Symbol.iterator](): Iterator<[K, T]> {
    for (const [k, v] of Object.entries(this) as [K, T][]) {
      yield [k, v]
    }
  }
}