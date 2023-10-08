import { parser } from "../../../";
import { JSLexer, TokenType } from "../lexer";
import { 
  BlockComment,
  BlockStatement,
	CallExpression,
	ClassBody,
	ClassDeclaration,
	ClassMethod,
	ClassProperty,
	DocComment,
	Expression, 
	FunctionDeclaration, 
	Identifier, 
	IfStatement, 
	LineComment, 
	NodeTypes, 
	Parameter, 
	Property, 
	StringLiteral, 
	VariableDeclaration 
} from "./types";

export class JSParser extends parser.Parser<TokenType, NodeTypes> 
{

	constructor() {
		super(new JSLexer());
	}

	#trim() {
		while (this.willContinue() && this.isAny("Br", "Tab", "Space")) {
			this.eat();
		}
	}

	protected parse(): Expression {
		this.#trim();
    let expr;

		switch (this.type()) {

			case "SlashAsterisk": {
				expr = this.#parseBlockComment()
        break;
			}

			case "SlashDoubleAsterisk": {
				expr = this.#parseDocComment()
        break;
			}

			case "Var":
			case "Let":
			case "Const": {
				expr = this.#parseVariableDeclaration()
        break;
			}

			case "Async": {
				this.eat();
				this.#trim()
				if (!this.is("Function")) {
					throw "Expected function keyword after async."
				}

				expr = this.#parseFunctionDeclaration(true);
        break;
			}

			case "Function": {
				expr = this.#parseFunctionDeclaration(false);
        break;
			}

			case "Class": {
				expr = this.#parseClassDeclaration();
        break;
			}

			case "If": {
				expr = this.#parseIfStatement();
        break;
			}

			case "OpenBracket": {
				expr = this.#parseBlock();
        break;
			}


			default:
				expr = this.#parseExpression();
		}

    this.#trim();

    if (this.if("Semicolon")) {
      this.#trim();
    }

    return expr;
	}

	#parseBlockComment(): BlockComment {
		this.eat();
		let content = "";
		while (this.willContinue() && this.type() !== "AsteriskSlash") {
			content += this.eat().value;
		}
		
		this.expect("AsteriskSlash", "Expected asterisk slash to end Block comment.")
		this.#trim();
		return this.new("BlockComment", {
			content,
		});
	}

	#parseDocComment(): DocComment {
		this.eat();
		let content = "";
		while (this.willContinue() && this.type() !== "AsteriskSlash") {
			content += this.eat().value;
		}
		
		this.expect("AsteriskSlash", "Expected asterisk slash to end Doc comment.")
		this.#trim();
		return this.new("DocComment", {
			content,
		});
	}

	#parseLineComment(): LineComment {
		this.eat();
		let content = "";
		while (this.willContinue() && this.type() !== "Br") {
			content += this.eat().value;
		}
		
		this.expect("Br", "Expected break to end line comment.")
		this.#trim();
		return this.new("LineComment", {
			content,
		});
	}

	#parseVariableDeclaration(): VariableDeclaration {
		const kind = this.eat<"Const" | "Var" | "Let">().type;
		this.#trim();
		const identifier = this.new("Identifier", {
			symbol: this.expect("Identifier", (
				`Expected Identifier after ${kind}`
			)).value
		})
		
		this.#trim();
		if (this.is("Semicolon")) {
			if (kind === "Const") {
				throw ("Must specify expression for 'const'");
			}
			return this.new("VariableDeclaration", {
				kind, 
				identifier, 
				value: null
			});
		}

		this.expect("Equals", (
			`Expected Equals after identifier in ${kind} declaration`
		))
		this.#trim();
		const value = this.#parseExpression();
		this.#trim();
		return this.new("VariableDeclaration", {
			kind, 
			identifier, 
			value
		})
	}

	#parseFunctionDeclaration(async: boolean): FunctionDeclaration {
		this.eat();
		this.#trim();
		const generator = !!this.if("Asterisk");
		if (generator) {
			this.#trim();
		}
		const identifier = this.new("Identifier", {
			symbol: this.expect("Identifier", (
				`Expected Identifier for function declaration`
			)).value
		})
		this.#trim();
		this.expect("OpenParen", (
			"Expected parenthesis after function identifier"
		))
		this.#trim();

		const params = this.#parseParameters();

		if (!this.is("OpenBracket")) throw (
			"Expected bracket to open function body"
		)
		this.#trim();
		const body = this.#parseBlock();
		this.#trim();

		return this.new("FunctionDeclaration", {
			identifier, 
			params, 
			body, 
			async, 
			generator,
		})
		

	}

	#parseParameters(): Parameter[] {
		const params: Parameter[] = [];

		while(this.willContinue() && this.isnt("CloseParen")) {
			let spread = this.is("Spread");
			if (spread) {
				this.eat();
				this.#trim();
			}
      const identifier = this.new("Identifier", {
        symbol: this.expect("Identifier", (
          `Expected Identifier for function declaration`
        )).value
      })
      this.#trim();
			let def: Expression | null = null;
			
      if (!spread && this.is("Equals")) {
        this.eat();
        this.#trim();
				def = this.#parseExpression();
			}

			params.push(this.new("Parameter", {
				spread,
				identifier,
				default: def
			}))
			this.#trim();
			
			if (this.type() === "Comma") {
				this.eat()
				this.#trim();
			}
		}

		this.expect("CloseParen", (
			"Expected parenthesis to close function params"
		))
		this.#trim();
		return params;
	}

	#parseClassDeclaration(): ClassDeclaration {
		this.eat();
		this.#trim();
		const identifier = this.new("Identifier", {
			symbol: this.expect("Identifier", (
				`Expected Identifier for function declaration`
			)).value
		})
		this.#trim();
		let extend: Expression | null = null;
		if (this.is("Extends")) {
			this.eat();
			this.#trim();
			extend = this.#parseExpression();
			this.#trim();
		}

		this.expect("OpenBracket", (
			"Expected bracket to open class body"
		))
		this.#trim();
		const body = this.#parseClassBody();
		this.#trim();

		return this.new("ClassDeclaration", {
			identifier, body, extend
		})
	}

	#parseClassBody(): ClassBody {
		const props: ClassBody["props"] = [];
		while(this.willContinue() && this.isnt("CloseBracket")) {
			const priv = !!this.if("Hash");
			this.#trim();
			if (this.isnt("Identifier")) {
				throw "Expected identifier";
			}
			const identifier = this.#parseIdentifier();
			this.#trim();
			if (this.is("OpenParen")) {
				props.push(this.#parseClassMethod(identifier, priv))
			}
			else {
				props.push(this.#parseClassProperty(identifier, priv))
			}
			this.#trim();
		}
		this.expect("CloseBracket", (
			"Expected bracket to close class body"
		))
		this.#trim();
		return this.new("ClassBody", {
			props
		})
	}
	
	#parseClassMethod(identifier: Identifier, priv: boolean): ClassMethod {
		this.eat();
		this.#trim();

		const params = this.#parseParameters();
		this.#trim();

		if (!this.is("OpenBracket")) throw (
			"Expected bracket to open class method body"
		)
		this.#trim();
		const body = this.#parseBlock();
		this.#trim();

		return this.new("ClassMethod", {
			identifier,
			private: priv,
			params,
			body
		})
	}
	
	#parseClassProperty(identifier: Identifier, priv: boolean): ClassProperty {
		
		let value: Expression | null = null;
		if (this.is("Equals")) {
			this.eat();
			this.#trim();

			value = this.#parseExpression();
			this.#trim();
		}

		this.expect("Semicolon", "Expected semicolon to end property declaration");
		this.#trim();

		return this.new("ClassProperty", {
			identifier,
			private: priv,
			value
		})

	}
	
	#parseIfStatement(): IfStatement {
		this.eat();
		this.#trim();
		this.expect("OpenParen", (
			"Expected parenthesis after If keyword"
		))
		this.#trim();
		const condition = this.#parseExpression();
		this.#trim();
		this.expect("CloseParen", (
			"Expected parenthesis after If condition"
		))
		this.#trim();
		let body: Expression | BlockStatement

		if (this.is("OpenBracket")) {
			body = this.#parseBlock();
		}
		else {
			body = this.#parseExpression();
		}

		return this.new("IfStatement", {
			condition,
			body
		})
	}

	#parseBlock(): BlockStatement {
		this.eat();
		this.#trim();

		const body: Expression[] = [];
		while (this.willContinue() && this.isnt("CloseBracket")) {
			body.push(this.parse());
			this.#trim();
		}

		this.expect("CloseBracket", "Expected bracket to end block");
		this.#trim();
		return this.new("BlockStatement", {nodes: body})
	}

	#parseExpression(): Expression {
		return this.#parseAssignment();
	}

	#parseAssignment(): Expression {
		const assigne = this.#parseAdditive();
		this.#trim();

		if (this.willContinue() && this.isAny(
			"Equals", "PlusEquals", "DashEquals",
			"PercentEquals", "SlashEquals", "AsteriskEquals"
		)) {
			const operator = this.eat().type;
			this.#trim();
			const value = this.#parseExpression();
			this.#trim();
			
			this.expect("Semicolon", (
				`Expected Semicolon after expression after assignment expression`
			))
			this.#trim();

			return this.new("AssignmentExpression", {
				assigne, operator, value
			})
		}

		return assigne;
	}

  #parseAdditive(): Expression {

    const left = this.#parseMultiplicative();

    this.#trim();
    if (this.willContinue() && this.isAny("Dash", "Plus")) {
      const operator = this.eat().type;
      this.#trim();
      return this.new("AdditiveExpression", {
        left,
        operator,
        right: this.#parseExpression()
      })
    }

    return left;
  }

	#parseMultiplicative(): Expression {

		const left = this.#parseComparative();

		this.#trim();
		if (this.willContinue() && this.isAny("Asterisk", "Slash", "Percent")) {
			const operator = this.eat().type;
			this.#trim();
			return this.new("AdditiveExpression", {
				left,
				operator,
				right: this.#parseExpression()
			})
		}

		return left;
	}

  #parseComparative(): Expression {

    const left = this.#parseMemberCall();

    this.#trim();
    if (this.willContinue() && this.isAny(
      "DoublePipe", "DoubleAmpersand", 
      "DoubleEquals",
      "TripleEquals",
      "MoreThanEqual", "MoreThan",
      "LessThanEqual", "LessThan",
    )) {
      const operator = this.eat().type;
      this.#trim();
      return this.new("AdditiveExpression", {
        left,
        operator,
        right: this.#parseExpression()
      })
    }

    return left;
  }

	#parseMemberCall(): Expression {
		let member: Expression = this.#parseMember();
		this.#trim();
		if (this.is("OpenParen")) {
			member = this.#parseCall(member)
		}
		return member;
	}

	#parseMember(): Expression {
		let object = this.#parsePrimary();
		this.#trim();
		while (this.willContinue() && this.isAny("Period", "OpenSquare")) {

			const computed = this.is("OpenSquare");
			this.eat();
			this.#trim();
			const property = this.#parseExpression();
			this.#trim();

			if (computed) {
				this.expect("CloseSquare", (
					"Expected closing square bracket in member expression"
				))
				this.#trim();
			}

			object = this.new("MemberExpression", {
				computed,
				property,
				object
			})

		}
		return object;
	}

	#parseCall(caller: Expression): CallExpression {
		this.eat();
		this.#trim();
		const args: Expression[] = [];
		while(this.willContinue() && this.isnt("CloseParen")) {
			args.push(this.#parseExpression());
			this.#trim();
			
			if (this.type() === "Comma") {
				this.eat()
				this.#trim();
			}
		}
		this.expect("CloseParen", (
			"Expected closing parenthesis to end argument list"
		))
		this.#trim();
		let callExpr = this.new("CallExpression", {
			caller,
			args
		})
		if (this.is("OpenParen")) {
			callExpr = this.#parseCall(callExpr);
			this.#trim();
		}
		return callExpr;
	}

	#parsePrimary(): Expression {
		switch(this.type()) {

			case "Return": {
				this.eat();
				this.#trim();
				return this.new("ReturnExpression", {
					node: this.#parseExpression()
				})
			}

			case "Void": {
				this.eat();
				this.#trim();
				return this.new("VoidExpression", {
					node: this.#parseExpression()
				})
			}

			case "New": {
				this.eat();
				this.#trim();
				return this.new("NewExpression", {
					node: this.#parseExpression()
				})
			}

			case "TypeOf": {
				this.eat();
				this.#trim();
				return this.new("TypeOfExpression", {
					node: this.#parseExpression()
				})
			}

			case "InstanceOf": {
				this.eat();
				this.#trim();
				return this.new("InstanceOfExpression", {
					node: this.#parseExpression()
				})
			}

			case "SingleQuotes": return this.#parseString("Single"); 
			case "DoubleQuotes": return this.#parseString("Double");

			case "DoubleSlash": {
				return this.#parseLineComment();
			}
			case "OpenBracket": {
				this.eat();
				this.#trim();
				const props: Property[] = [];
				while (this.willContinue() && this.type() !== "CloseBracket") {

					const key = this.expect("Identifier", 
						"Expected identifier as key"
					).value;
					this.#trim();
					let value: Expression | null = null;

					if (this.is("Colon")) {
						this.eat();
						this.#trim();
						value = this.#parseExpression();
						this.#trim();
					}

					props.push(this.new("Property", {key, value}));

					if (this.type() === "Comma") {
						this.eat()
						this.#trim();
					}
				}
				const obj = this.new("ObjectLiteral", {props})
				this.#trim();
				this.expect("CloseBracket", 
					"Expected closing bracket to end Object literal."
				)
				return obj;
			}

			case "OpenSquare": {
				this.eat();
				this.#trim();
				const entries: Expression[] = [];
				while (this.willContinue() && this.type() !== "CloseSquare") {
					entries.push(this.#parseExpression());
					this.#trim();
					if (this.type() === "Comma") {
						this.eat()
						this.#trim();
					}
				}
				const array = this.new("ArrayLiteral", {items: entries})
				this.#trim();
				this.expect("CloseSquare", 
					"Expected closing square bracket to end Array literal."
				)
				return array;
			}

			case "OpenParen": {
				this.eat();
				this.#trim();
				const group = this.new("GroupExpression", {
					expr: this.#parseExpression()
				})
				this.#trim();
				this.expect("CloseParen", 
					"Expected closing parenthesis to end group expression."
				)
				return group;
			}

			case "Number": {
				let raw = this.eat().value;
				let float = this.type() === "Period";

				if (float) {
					raw += this.eat().value;
					raw += this.expect("Number", 
						"Expected number after decimal period"
					).value;
				}

				return this.new("NumericLiteral", {
					value: parseInt(raw),
					raw,
					float
				})
			}

			case "Identifier": {
				return this.new("Identifier", {
					symbol: this.eat().value,
				})
			}

			default: {
				throw "Primary expression";
			}
		}
	}

	#parseIdentifier(): Identifier {
		return this.new("Identifier", {
			symbol: this.eat().value,
		})
	}
 
	#parseString(quotes: "Single" | "Double"): StringLiteral {
		this.eat();
		const quoteType: TokenType = `${quotes}Quotes`;
		let content = "";
		while (this.willContinue() && this.type() !== quoteType) {
			content += this.eat().value;
		}
		
		this.expect(quoteType, "Expected closing quotes to end String literal.")
		this.#trim();
		return this.new("StringLiteral", {
			content,
			quotes
		});

	}
}