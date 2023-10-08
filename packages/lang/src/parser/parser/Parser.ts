import { TType, Token, TokenList, Lexer } from "../lexer";
import { AST } from "./AST";
import { NodesObj, Node } from "./types";

class ParserError extends Error {
	constructor(tokens: TokenList<any>, err: unknown) {
		const token = tokens[0]!;
		const {line, column} = token.first();
		super(`${line}:${column}\nUnexpected token "${token.type}", ${err}`);
	}
}

export abstract class Parser<
	T extends string, 
	const Nodes extends NodesObj
> {

	#lexer: Lexer<T>
	constructor(lexer: Lexer<T>) {
		this.#lexer = lexer;
	}

	body: Nodes[keyof Nodes][] = [];
	#tokens!: TokenList<T>

	produce(source: string): AST<Nodes> {

		const ast = new AST<Nodes>();
		this.#tokens = this.#lexer.convert(source);

		while (this.willContinue()) {
			try {
				const p = this.parse() as unknown as Nodes[keyof Nodes];
				this.body.push(p);
				ast.program.body.push(p);
			}
			catch(error) {
				throw new ParserError(this.#tokens, error);
			}
		}

		return ast;
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

	protected if<Ty extends TType<T>>(type: TType<Ty>): Token<Ty> | null {
		if (type === this.#tokens[0]!.type) {
			return this.#tokens.shift() as Token<Ty>;
		}
		return null;
	}

	protected is(type: TType<T>): boolean {
		return type === this.#tokens[0]!.type;
	}

	protected isnt(type: TType<T>): boolean {
		return type !== this.#tokens[0]!.type;
	}

	protected isAny(...types: TType<T>[]): boolean {
		return types.includes(this.#tokens[0]!.type);
	}

	protected expect<Ty extends TType<T>>(type: Ty, error: string): Token<Ty> {
		if (this.#tokens[0]!.type !== type) {
			throw error;
		}
		return this.#tokens.shift()! as Token<Ty>;
	}

}