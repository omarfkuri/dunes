import { TType, Token, TokenList, Tokenizer } from "../tokenizer";
import { AST } from "./AST";
import { NodesObj, Node } from "./types";


export abstract class Parser<
	T extends string, 
	const Nodes extends NodesObj = {}
> {

	constructor(protected tokenizer: Tokenizer<T>) {}

	#tokens!: TokenList<T>

	produce(source: string): AST<Nodes> {

		const ast = new AST<Nodes>();
		this.#tokens = this.tokenizer.convert(source);

		while (this.willContinue()) {
			ast.program.body.push(this.parse() as unknown as Nodes[keyof Nodes])
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