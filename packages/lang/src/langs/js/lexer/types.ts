import type { lexer } from "../../../index.js";


export type TokenType = lexer.TType<(
	
	| "Let"
	| "Var"
	| "Const"
	| "Function"
  | "Arrow"
	| "Async"
	| "Class"
	| "If"
	| "Else"
	| "New"
	| "Throw"
  | "Return"
	| "Void"
	| "TypeOf"
	| "InstanceOf"

	| "Br"
	| "Tab"
	| "Space"
	
	| "Undefined"

	| "Number"
	| "Identifier"

	| "Plus"
	| "PlusEquals"
	| "Dash"
	| "DashEquals"
	| "Slash"
	| "SlashEquals"
	| "Percent"
	| "PercentEquals"
	| "Asterisk"
	| "AsteriskEquals"
	
	| "Equals"
  | "DoubleEquals"
  | "TripleEquals"
  | "Ampersand"
  | "AmpersandEquals"
  | "DoubleAmpersand"
  | "Pipe"
  | "PipeEquals"
  | "DoublePipe"
  | "LessThan"
  | "LessThanEqual"
  | "MoreThan"
  | "MoreThanEqual"

	| "Spread"
	| "Extends"
	| "DoubleQuotes"
	| "SingleQuotes"

	| "DoubleSlash"
	| "SlashAsterisk"
	| "SlashDoubleAsterisk"
	| "AsteriskSlash"

	| "Hash"
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
