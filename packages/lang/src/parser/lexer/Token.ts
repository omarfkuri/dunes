import type { Char } from "./Char";
import { TType } from "./types";

export class Token<T extends string> {
	#value: TokenValue
	constructor(public type: T, ...chars: Char[]) {
		this.#value = new TokenValue(chars);
	}

	get value(): string {
		return String(this.#value);
	}
}

/*->
macro lastItem<T>(arr: T[]): T {
	return arr[arr.length - 1];
}

// index.pts
const myArray = [1, 2, 3, 4];
const last = lastItem(myArray);


// index.js
const myArray = [1, 2, 3, 4];
const last = myArray[myArray.length - 1]

*/


class TokenValue extends String {

	#chars: Char[]

	constructor(chars: Char[]) {
		if (!chars.length) 
			throw "Empty chars in TokenValue";
		if (chars[0] as unknown as string === "$$EOF$$") 
			super();
		else 
			super(chars.map(({value}) => value).join(""));

		this.#chars = chars;
	}

	first(): Char {
		return this.#chars[0]!
	}

	last(): Char {
		return this.#chars[this.#chars.length - 1]!
	}

}

export class TokenList<T extends string> extends Array<Token<TType<T>>> {

}