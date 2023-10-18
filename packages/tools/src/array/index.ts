
export * from "./funcs.js"
export * from "./types.js"


export function repeat(times: number, from = 1) {
  let arr = [];
  while (times >= from) {
    arr.push(times);
    times--;
  }
  return arr.reverse();
}