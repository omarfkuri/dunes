import { Char, Parser, Tokenizer, Node, TType } from "../src";
import { JSTokenizer, TokenType } from "./tokenizer";


type NodeType = (
	| "NumericLiteral"
	| "StringLiteral"
	| "IdentifierLiteral"
	| "AdditiveExpression"
  | "MultiplicativeExpression"
  | "GroupExpression"
  | "ArrayLiteral"
  | "VariableDeclaration"
)

interface Expression extends Node<NodeType> {}

interface Statement extends Expression {}

interface VariableDeclaration extends Statement {
	type: "VariableDeclaration"
	kind: "Var" | "Let" | "Const"
	identifier: IdentifierLiteral
	value: Expression | null
}

interface BinaryExpression extends Expression {
	left: Expression
	operator: TokenType
	right: Expression
}

interface GroupExpression extends Expression {
	type: "GroupExpression"
	expr: Expression
}

interface AdditiveExpression extends BinaryExpression {
	type: "AdditiveExpression"
}

interface MultiplicativeExpression extends BinaryExpression {
	type: "MultiplicativeExpression"
}

interface NumericLiteral extends Expression {
	type: "NumericLiteral"
	raw: string
	value: number
}

interface StringLiteral extends Expression {
	type: "StringLiteral"
	content: string
	quotes: "single" | "double"
}

interface IdentifierLiteral extends Expression {
	type: "IdentifierLiteral"
	symbol: string
}

interface ArrayLiteral extends Expression {
	type: "ArrayLiteral"
	entries: Expression[]
}


export class JSParser extends Parser<TokenType, {
	AdditiveExpression: AdditiveExpression
	MultiplicativeExpression: MultiplicativeExpression
	GroupExpression: GroupExpression
	NumericLiteral: NumericLiteral
	StringLiteral: StringLiteral
	ArrayLiteral: ArrayLiteral
	IdentifierLiteral: IdentifierLiteral
	VariableDeclaration: VariableDeclaration
}> 
{

	constructor() {
		super(new JSTokenizer());
	}

	protected parse(): Expression {
		switch (this.type()) {

			case "Var":
			case "Let":
			case "Const": {
				return this.#parseVariableDeclaration()
			}

			default:
				return this.#parseExpression();
		}
	}

	#parseVariableDeclaration(): VariableDeclaration {
		const kind = this.eat().type as "Const" | "Var" | "Let";
		const {value: symbol} = this.expect("Identifier", new SyntaxError(
			`Expected Identifier after ${kind}`
		))
		const identifier = this.new("IdentifierLiteral", {symbol,})

		if (this.type() === "Semicolon") {
			if (kind === "Const") {
				throw new SyntaxError("Must specify expression for 'const'");
			}
			this.eat();
			return this.new("VariableDeclaration", {
				kind, 
				identifier, 
				value: null
			});
		}

		this.expect("Equals", new SyntaxError(
			`Expected Equals after identifier in ${kind} declaration`
		))
		const value = this.#parseExpression();
		this.expect("Semicolon", new SyntaxError(
			`Expected Semicolon after expression in ${kind} declaration`
		))
		return this.new("VariableDeclaration", {
			kind, 
			identifier, 
			value
		})
	}

	#parseExpression(): Expression {
		return this.#parseAdditive();
	}

	#parseAdditive(): Expression {

		const left = this.#parseMultiplicative();

		if (this.willContinue() && this.isAny("Dash", "Plus")) {
			return this.new("AdditiveExpression", {
				left,
				operator: this.eat().type,
				right: this.#parseExpression()
			})
		}

		return left;
	}

	#parseMultiplicative(): Expression {

		const left = this.#parsePrimary();

		if (this.willContinue() && this.isAny("Asterisk", "Slash", "Percent")) {
			return this.new("AdditiveExpression", {
				left,
				operator: this.eat().type,
				right: this.#parseExpression()
			})
		}

		return left;
	}

	#parsePrimary(): Expression {
		switch(this.type()) {

			case "OpenSquare": {
				this.eat();
				const entries: Expression[] = [];
				while (this.willContinue() && this.type() !== "CloseSquare") {
					entries.push(this.#parseExpression());
					if (this.type() === "Comma") {
						this.eat()
					}
					else break;
				}
				const array = this.new("ArrayLiteral", {entries})
				this.expect("CloseSquare", new SyntaxError(
					"Expected closing square bracker to end Array literal."
				))
				return array;
			}

			case "OpenParen": {
				this.eat();
				const group = this.new("GroupExpression", {
					expr: this.#parseExpression()
				})
				this.expect("CloseParen", new SyntaxError(
					"Expected closing parenthesis to end group expression."
				))
				return group;
			}

			case "Number": {
				const raw = this.eat().value;
				return this.new("NumericLiteral", {
					value: parseInt(raw),
					raw,
				})
			}

			case "Identifier": {
				return this.new("IdentifierLiteral", {
					symbol: this.eat().value,
				})
			}

			default: {
				throw new SyntaxError(`Unexpected token "${this.type()}"`);
			}
		}
	}
}