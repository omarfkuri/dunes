import { repeat } from "../array/index.js";

export class Random {
  static readonly ABC = "abcdefghijklmnopqrstuvwxyz";

  static int(from: number, to: number) {
    return Math.floor(Math.random() * to) + from
  }
}

export function number() {
	return Random.int(0, 9)
}

export function digits(ammount = 1) {
	return repeat(ammount).map(() => number()).join("")
}

export function string(l = 6) {
	return repeat(l).map(() => letter()).join("")
}

export function entry<T>(arr: T[]) {
	return arr[Random.int(1, arr.length) - 1]
}

export function word(l: number = 6, c = false) {
	const word = string(l)
	return c ? Case(word) : word
}

export const ABC = {
	en: "abcdefghijklmnopqrstuvwxyz",
	es: "abcdefghijklmnñopqrstuvwxyz"
}

export function letter() {
	return Random.ABC[Random.int(0, 25)]
}

export function date(from: string = "01/01/1970", to?: string) {
	return new Date(Random.int(new Date(from).getMilliseconds(), to? new Date(to).getMilliseconds(): Date.now()))
}

export function Case(string: string) {
	return string.split("").map(
		e => Random.int(0, 2) >= 1? e.toLowerCase(): e.toUpperCase()
	)
	.join("")
}