import { Char, CharList } from "./Char";
import { Token, TokenList } from "./Token";
import { TType } from "./types";

export abstract class Lexer<T extends string> {

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

	protected is(str: string, n = 0): boolean {
		return this.#chars[n]!.value === str;
	}

	protected value(n = 0): string {
		return this.#chars[n]!.value;
	}

	protected match(reg: RegExp, n = 0): boolean {
		return reg.test(this.#chars[n]!.value);
	}

	protected equal(str: string): boolean {
		return this.#chars[0]!.value === str;
	}

	protected isLetter(): boolean {
		const x = this.#chars[0]!.value;
		return x.toUpperCase() !== x.toLowerCase();
	}

}