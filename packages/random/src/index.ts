type Lang = keyof typeof ABC;
type DateString = string

export function repeat(times: number, from = 1) {
	let arr = [];
	while (times >= from) {
		arr.push(times);
		times--;
	}
	return arr.reverse();
}

export function int(from: number, to: number) {
	return Math.floor(Math.random() * to) + from
}


export function number() {
	return int(0, 9)
}

export function digits(ammount = 1) {
	return  repeat(ammount).map(() => number()).join("")
}

export function string(l = 6, lang: Lang = "en") {
	return repeat(l).map(() => letter(lang)).join("")
}

export function entry<T>(arr: T[]) {
	return arr[int(1, arr.length) - 1]
}

export function word(l: number = 6, lang: Lang = "en", c = false) {
	const word = string(l, lang)
	return c ? Case(word) : word
}

export const ABC = {
	en: "abcdefghijklmnopqrstuvwxyz",
	es: "abcdefghijklmnñopqrstuvwxyz"
}

export function letter(lang: Lang = "en") {
	return ABC[lang][int(0, 25)]
}

export function date(from: DateString = "01/01/1970", to?: DateString) {
	return new Date(int(new Date(from).getMilliseconds(), to? new Date(to).getMilliseconds(): Date.now()))
}

export function Case(string: string) {
	return string.split("").map(
		e => int(0, 2) >= 1? e.toLowerCase(): e.toUpperCase()
	)
	.join("")
}