import type { Act } from "./types/index.js";





export function act<T>(act: Act<T>): Act<T> {
  return act;
}