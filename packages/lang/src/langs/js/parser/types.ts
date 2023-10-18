import { parser } from "../../../index.js";
import type { TokenType } from "../lexer/index.js";

export type NodeType = (
  | "FunctionDeclaration"
  | "ClassDeclaration"
  | "FunctionDeclaration"
  | "VariableDeclaration"
  | "VariableDeclarator"
  | "BlockStatement"
  | "IfStatement"
  | "ElseIfStatement"
  | "ElseStatement"

	| "BinaryExpression"
  | "CallExpression"
  | "AssignmentExpression"
  | "MemberExpression"
  | "GroupExpression"
  | "SequenceExpression"
  
  | "BlockComment"
  | "LineComment"
  | "DocComment"

  | "ObjectExpression"
  | "ObjectPattern"
  
  | "ArrayExpression"
  | "ArrayPattern"
  | "AssignmentPattern"

	| "NumericLiteral"
	| "Property"
	| "Parameter"
	| "StringLiteral"
	| "Identifier"
  
  | "ClassBody"
  | "ClassMethod"
	| "ClassProperty"

	| "FunctionExpression"
  | "ArrowFunctionExpression"

  | "ReturnExpression"
  | "ThrowExpression"
	| "NewExpression"
	| "TypeOfExpression"
	| "InstanceOfExpression"
	| "VoidExpression"
)

export type AnyNode = (
  | FunctionDeclaration
  | ClassDeclaration
  | FunctionDeclaration
  | VariableDeclaration
  | BlockStatement
  | IfStatement
  | ElseIfStatement
  | ElseStatement

  | BinaryExpression
  | CallExpression
  | AssignmentExpression
  | MemberExpression
  | GroupExpression
  | SequenceExpression
  
  | BlockComment
  | LineComment
  | DocComment

  | ArrayExpression
  | ObjectExpression
  | NumericLiteral
  | Property
  | Parameter
  | StringLiteral
  | Identifier
  
  | AssignmentPattern
  | ArrayPattern
  
  | ClassBody
  | ClassMethod
  | ClassProperty

  | FunctionExpression
  | ArrowFunctionExpression

  | ReturnExpression
  | ThrowExpression
  | NewExpression
  | TypeOfExpression
  | InstanceOfExpression
  | VoidExpression
)

export type Assignee = (
  | Identifier
  | ObjectPattern
  | ArrayPattern
  | AssignmentPattern
)

export type Init = (
  | Expression
  | null
)

export type ClassProps = (
  | ClassMethod 
  | ClassProperty
)

export interface NodeTypes extends parser.NodesObj {
	VariableDeclaration: VariableDeclaration
  VariableDeclarator: VariableDeclarator
	FunctionDeclaration: FunctionDeclaration
	ClassDeclaration: ClassDeclaration
	BlockStatement: BlockStatement
	IfStatement: IfStatement
	ElseIfStatement: ElseIfStatement
	ElseStatement: ElseStatement

  BinaryExpression: BinaryExpression
	GroupExpression: GroupExpression
  SequenceExpression: SequenceExpression
  CallExpression: CallExpression
  AssignmentExpression: AssignmentExpression
  MemberExpression: MemberExpression

  Identifier: Identifier
	NumericLiteral: NumericLiteral
  StringLiteral: StringLiteral
	
  ArrayExpression: ArrayExpression
	ObjectExpression: ObjectExpression
	Property: Property
	
  AssignmentPattern: AssignmentPattern
	Parameter: Parameter
	ArrayPattern: ArrayPattern
  ObjectPattern: ObjectPattern
  
  ClassBody: ClassBody
  ClassMethod: ClassMethod
	ClassProperty: ClassProperty

	BlockComment: BlockComment
	LineComment: LineComment
	DocComment: DocComment

	FunctionExpression: FunctionExpression
  ArrowFunctionExpression: ArrowFunctionExpression

  ReturnExpression: ReturnExpression
  ThrowExpression: ThrowExpression
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
	declarators: VariableDeclarator[]
}

export interface VariableDeclarator extends Statement {
  type: "VariableDeclarator"
  id: Assignee
  init: Init
}

export interface FunctionDeclaration extends Statement {
	type: "FunctionDeclaration"
	id: Identifier
	params: Parameter[]
	async: boolean
	generator: boolean
	body: BlockStatement
}

export interface ClassDeclaration extends Statement {
	type: "ClassDeclaration"
	id: Identifier
	extend: Init
	body: ClassBody
}


export interface ClassBody extends Expression {
	type: "ClassBody"
	props: ClassProps[]
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
	id: Identifier // | ComputedValue
}


export interface ClassMethod extends ClassVar {
	type: "ClassMethod"
	params: Parameter[]
	body: BlockStatement
}

export interface ClassProperty extends ClassVar {
	type: "ClassProperty"
	init: Init
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

export interface BinaryExpression extends Expression {
  type: "BinaryExpression"
  kind: "add" | "mul" | "com"
	operator: TokenType
	left: Expression
	right: Expression
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

export interface ArrayExpression extends Expression {
	type: "ArrayExpression"
	items: Expression[]
}

export interface ArrayPattern extends Expression {
  type: "ArrayPattern"
  items: Expression[]
}

export interface ObjectExpression extends Expression {
	type: "ObjectExpression"
	props: Property[]
}


export interface ObjectPattern extends Expression {
  type: "ObjectPattern"
  props: Property[]
}

export interface Property extends Expression {
	type: "Property"
	key: PropertyKey
	init: Init
}

export interface Parameter extends Expression {
	type: "Parameter"
	spread: boolean
	id: Assignee
	init: Init
}

export interface ReturnExpression extends Expression {
	type: "ReturnExpression"
	node: Expression
}

export interface ThrowExpression extends Expression {
  type: "ThrowExpression"
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

export interface GroupExpression extends Expression {
  type: "GroupExpression"
  node: Expression
}

export interface AssignmentPattern extends Expression {
  type: "AssignmentPattern"
  operator: TokenType
  left: Assignee
  right: Expression
}

export interface SequenceExpression extends Expression {
  type: "SequenceExpression"
  nodes: Expression[]
}

export interface BaseFunctionExpression extends Expression {
  async: boolean
  generator: boolean
  params: Parameter[]
}

export interface FunctionExpression extends BaseFunctionExpression {
  type: "FunctionExpression"
  body: BlockStatement
  id: Identifier | null
}

export interface ArrowFunctionExpression extends BaseFunctionExpression {
  type: "ArrowFunctionExpression"
  expression: boolean
  body: BlockStatement | Expression

}

