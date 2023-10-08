import { parser } from "../../../";
import { TokenType } from "../lexer";

export type NodeType = (
  | "FunctionDeclaration"
  | "ClassDeclaration"
  | "FunctionDeclaration"
  | "VariableDeclaration"
  | "BlockStatement"
  | "IfStatement"
  | "ElseIfStatement"
  | "ElseStatement"

	| "AdditiveExpression"
  | "MultiplicativeExpression"
  | "ComparativeExpression"
  | "CallExpression"
  | "AssignmentExpression"
  | "MemberExpression"
  | "GroupExpression"
  
  | "BlockComment"
  | "LineComment"
  | "DocComment"

  | "ArrayLiteral"
  | "ObjectLiteral"
	| "NumericLiteral"
	| "Property"
	| "Parameter"
	| "StringLiteral"
	| "Identifier"
  
  | "ClassBody"
  | "ClassMethod"
	| "ClassProperty"

	| "ReturnExpression"
	| "NewExpression"
	| "TypeOfExpression"
	| "InstanceOfExpression"
	| "VoidExpression"
)

export interface NodeTypes extends parser.NodesObj {
	VariableDeclaration: VariableDeclaration
	FunctionDeclaration: FunctionDeclaration
	ClassDeclaration: ClassDeclaration
	BlockStatement: BlockStatement
	IfStatement: IfStatement
	ElseIfStatement: ElseIfStatement
	ElseStatement: ElseStatement

	AdditiveExpression: AdditiveExpression
	MultiplicativeExpression: MultiplicativeExpression
  ComparativeExpression: ComparativeExpression
	GroupExpression: GroupExpression
  CallExpression: CallExpression
  AssignmentExpression: AssignmentExpression
  MemberExpression: MemberExpression

	NumericLiteral: NumericLiteral
	Identifier: Identifier
	StringLiteral: StringLiteral
	ArrayLiteral: ArrayLiteral
	ObjectLiteral: ObjectLiteral
	Property: Property
	Parameter: Parameter
  
  ClassBody: ClassBody
  ClassMethod: ClassMethod
	ClassProperty: ClassProperty

	BlockComment: BlockComment
	LineComment: LineComment
	DocComment: DocComment

	ReturnExpression: ReturnExpression
	NewExpression: NewExpression
	TypeOfExpression: TypeOfExpression
	InstanceOfExpression: InstanceOfExpression
	VoidExpression: VoidExpression
}

export interface Expression extends parser.Node<NodeType> {}

export interface Statement extends Expression {}

export interface BlockStatement extends Statement {
	type: "BlockStatement"
	nodes: Expression[];
}

export interface IfStatement extends Statement {
	type: "IfStatement"
	body: BlockStatement | Expression
	condition: Expression
}

export interface ElseIfStatement extends Statement {
	type: "ElseIfStatement"
	body: BlockStatement | Expression
	condition: Expression
}

export interface ElseStatement extends Statement {
	type: "ElseStatement"
	body: BlockStatement | Expression
}

export interface VariableDeclaration extends Statement {
	type: "VariableDeclaration"
	kind: "Var" | "Let" | "Const"
	identifier: Identifier
	value: Expression | null
}

export interface FunctionDeclaration extends Statement {
	type: "FunctionDeclaration"
	identifier: Identifier
	params: Parameter[]
	async: boolean
	generator: boolean
	body: BlockStatement
}

export interface ClassDeclaration extends Statement {
	type: "ClassDeclaration"
	identifier: Identifier
	extend: Expression | null
	body: ClassBody
}


export interface ClassBody extends Expression {
	type: "ClassBody"
	props: (ClassMethod | ClassProperty)[]
}

export interface LineComment extends Expression {
	type: "LineComment"
	content: string
}

export interface DocComment extends Statement {
	type: "DocComment"
	content: string
}

export interface BlockComment extends Statement {
	type: "BlockComment"
	content: string
}


interface ClassVar extends Expression {
	private: boolean
	identifier: Identifier // | ComputedValue
}


export interface ClassMethod extends ClassVar {
	type: "ClassMethod"
	params: Parameter[]
	body: BlockStatement
}

export interface ClassProperty extends ClassVar {
	type: "ClassProperty"
	value: Expression | null
}

export interface CallExpression extends Expression {
	type: "CallExpression"
	args: Expression[]
	caller: Expression
}

export interface AssignmentExpression extends Expression {
	type: "AssignmentExpression"
	operator: TokenType
	assigne: Expression
	value: Expression
}

export interface MemberExpression extends Expression {
	type: "MemberExpression"
  object: Expression
  property: Expression
  computed: boolean
}

export interface GroupExpression extends Expression {
	type: "GroupExpression"
	expr: Expression
}

interface BinaryExpression extends Expression {
	left: Expression
	operator: TokenType
	right: Expression
}

export interface AdditiveExpression extends BinaryExpression {
	type: "AdditiveExpression"
}

export interface MultiplicativeExpression extends BinaryExpression {
	type: "MultiplicativeExpression"
}

export interface ComparativeExpression extends BinaryExpression {
  type: "ComparativeExpression"
}

export interface NumericLiteral extends Expression {
	type: "NumericLiteral"
	raw: string
	value: number
	float: boolean
}

export interface StringLiteral extends Expression {
	type: "StringLiteral"
	content: string
	quotes: "Single" | "Double"
}

export interface Identifier extends Expression {
	type: "Identifier"
	symbol: string
}

export interface ArrayLiteral extends Expression {
	type: "ArrayLiteral"
	items: Expression[]
}

export interface ObjectLiteral extends Expression {
	type: "ObjectLiteral"
	props: Property[]
}

export interface Property extends Expression {
	type: "Property"
	key: PropertyKey
	value: Expression | null
}

export interface Parameter extends Expression {
	type: "Parameter"
	spread: boolean
	identifier: Identifier
	default: Expression | null
}

export interface ReturnExpression extends Expression {
	type: "ReturnExpression"
	node: Expression
}

export interface NewExpression extends Expression {
	type: "NewExpression"
	node: Expression
}

export interface TypeOfExpression extends Expression {
	type: "TypeOfExpression"
	node: Expression
}

export interface InstanceOfExpression extends Expression {
	type: "InstanceOfExpression"
	node: Expression
}

export interface VoidExpression extends Expression {
	type: "VoidExpression"
	node: Expression
}