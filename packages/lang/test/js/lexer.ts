import { lexer } from "../../src";

export type TokenType = lexer.TType<(
	
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

export class JSLexer extends lexer.Lexer<TokenType> {

	protected override read() {

		if (this.match(/ |\t/)) {
			this.eat();
			return null;
		}

		if (this.isLetter()) {
			const chars: lexer.Char[] = [this.eat()];
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
			const chars: lexer.Char[] = [this.eat()];
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