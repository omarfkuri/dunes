import { Act } from "./types";





export function act<T>(act: Act<T>): Act<T> {
  return act;
}