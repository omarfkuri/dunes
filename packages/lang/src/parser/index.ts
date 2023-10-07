
interface Position {
	line: number,
	column: number
}

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

export type TType<T extends string> = T | "Undefined" | "EOF"

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

export interface NodeDecl {
	[key: string]: any
}

export interface NodesObj {
	[key: string]: NodeDecl
}

export interface Node<T extends PropertyKey> {
	type: T
}

export class NodeList<const Nodes extends NodesObj> extends Array<Nodes[keyof Nodes]> {

}

export abstract class Parser<
	T extends string, 
	const Nodes extends NodesObj = {}
> {

	constructor(protected tokenizer: Tokenizer<T>) {}

	#tokens!: TokenList<T>

	produce(source: string): AST<Nodes> {

		const body = new NodeList<Nodes>();
		this.#tokens = this.tokenizer.convert(source);

		while (this.willContinue()) {
			body.push(this.parse() as unknown as Nodes[keyof Nodes])
		}

		return new AST(body)
	}

	protected abstract parse(): Node<keyof Nodes>

	protected willContinue() {
		return this.#tokens[0]?.type !== "EOF";
	}

	protected new<T extends keyof Nodes>(
		type: T, 
		props: Omit<Nodes[T], "type">
	): Nodes[T] & {type: T}
	{
		return {
			type,
			...props
		} as Nodes[T] & {type: T}
	}

	protected eat<Ty extends TType<T>>(): Token<Ty> {
		return this.#tokens.shift() as Token<Ty>;
	}

	protected type(): TType<T> {
		return this.#tokens[0]!.type;
	}

	protected isAny(...types: TType<T>[]): boolean {
		return types.includes(this.#tokens[0]!.type);
	}

	protected expect<Ty extends TType<T>>(type: Ty, error: SyntaxError): Token<Ty> {
		if (this.#tokens[0]!.type !== type) {
			throw error;
		}
		return this.#tokens.shift()! as Token<Ty>;
	}

}

export interface Program<Nodes extends NodesObj> extends Node<"Program"> {
	body: NodeList<Nodes>
}

export class AST<const Nodes extends NodesObj> {
	program: Program<Nodes>
	constructor(body: NodeList<Nodes>) {
		this.program = {
			type: "Program", 
			body
		}
	}

	json(i = 2): string {
		return JSON.stringify(this.program, null, i);
	}
}