import { Position, TType } from "./types";

export class Char implements Position {
	constructor(
		public value: string,
		public line: number,
		public column: number
	) {}
}

export class CharList extends Array<Char> {

	constructor(source: string) {
		super();

		let line = 0;
		let column = 0;
		for (const ch of source) {
			this.push(new Char(ch, line, column));	
			if (ch === "\n") {
				line++;
				column = 0;
			}
			else {
				column++;
			}
		}
	}
}


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


export abstract class Tokenizer<T extends string> {

	#chars!: CharList

	convert(source: string): TokenList<T> {
		this.#chars = new CharList(source);
		const tokens = new TokenList<T>();
		while (this.#chars.length) {
			const token = this.read();
			if (token)
				tokens.push(token);
		}
		tokens.push(this.new("EOF", "$$EOF$$" as unknown as Char));
		return tokens;
	}

	protected abstract read(): Token<TType<T>> | null;

	protected new(type: TType<T>, ...chars: Char[]): Token<TType<T>> {
		return new Token(type, ...chars)
	}

	protected finished(): boolean {
		return this.#chars.length <= 0;
	}

	protected eat(): Char {
		return this.#chars.shift()!;
	}

	protected value(): string {
		return this.#chars[0]!.value;
	}

	protected match(reg: RegExp): boolean {
		return reg.test(this.#chars[0]!.value);
	}

	protected equal(str: string): boolean {
		return this.#chars[0]!.value === str;
	}

	protected isLetter(): boolean {
		const x = this.#chars[0]!.value;
		return x.toUpperCase() !== x.toLowerCase();
	}

}