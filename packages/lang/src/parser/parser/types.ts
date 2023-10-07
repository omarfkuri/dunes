import type { NodeList } from "./AST"

export interface NodeDecl {
	[key: string]: any
}

export interface NodesObj {
	[key: string]: NodeDecl
}

export interface Node<T extends PropertyKey> {
	type: T
}

export interface Program<Nodes extends NodesObj> extends Node<"Program"> {
	body: NodeList<Nodes>
}
