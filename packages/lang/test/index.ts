import { Char, Parser, Tokenizer, Node, TType } from "../src/parser";

type TokenType = TType<(
	
	| "Let"
	| "Var"
	| "Const"

	| "Number"
	| "Identifier"
	| "Plus"
	| "Dash"
	| "Slash"
	| "Percent"
	| "Asterisk"
	| "Equals"

	| "Semicolon"
	| "Colon"
	| "Comma"
	| "Period"

	// ()
	| "OpenParen" 
	| "CloseParen"
	// {}
	| "OpenBracket" 
	| "CloseBracket"
	// []
	| "OpenSquare" 
	| "CloseSquare"
)>

class JSTokenizer extends Tokenizer<TokenType> {

	protected override read() {

		if (this.match(/ |\t/)) {
			this.eat();
			return null;
		}

		if (this.isLetter()) {
			const chars: Char[] = [this.eat()];
			while (!this.finished() && (this.isLetter() || this.match(/[0-9]|_/))) {
				chars.push(this.eat());
			}

			const value = chars.map(({value}) => value).join("");

			switch (value) {
				case "let": return this.new("Let", ...chars);
				case "var": return this.new("Var", ...chars);
				case "const": return this.new("Const", ...chars);
				default: return this.new("Identifier", ...chars);
			}

		}

		if (this.match(/[0-9]/)) {
			const chars: Char[] = [this.eat()];
			while (!this.finished() && this.match(/[0-9]/)) {
				chars.push(this.eat());
			}
			return this.new("Number", ...chars);
		}


		switch(this.value()) {
			case "*": return this.new("Asterisk", this.eat());
			case "+": return this.new("Plus", this.eat());
			case "-": return this.new("Dash", this.eat());
			case "%": return this.new("Percent", this.eat());
			case "/": return this.new("Slash", this.eat());
			case "=": return this.new("Equals", this.eat());

			case ";": return this.new("Semicolon", this.eat());
			case ":": return this.new("Colon", this.eat());
			case ",": return this.new("Comma", this.eat());
			case ".": return this.new("Period", this.eat());

			case "(": return this.new("OpenParen", this.eat());
			case ")": return this.new("CloseParen", this.eat());

			case "{": return this.new("OpenBracket", this.eat());
			case "}": return this.new("CloseBracket", this.eat());

			case "[": return this.new("OpenSquare", this.eat());
			case "]": return this.new("CloseSquare", this.eat());
			default:
				return this.new("Undefined", this.eat());
		}
	}

}

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


class JSParser extends Parser<TokenType, {
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

const jsParser = new JSParser();

try {
	const result = jsParser.produce("let a = [1, 2, 3, 4];");
	console.log(result.json());
}
catch(err) {
	console.warn(err);
}

process.exit(0);
