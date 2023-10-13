import type { NodesObj, Program } from "./types.js";

export class NodeList<const Nodes extends NodesObj> extends Array<Nodes[keyof Nodes]> {}

export class AST<const Nodes extends NodesObj> {
	program: Program<Nodes>
	constructor() {
		this.program = {
			type: "Program", 
			body: new NodeList()
		}
	}

	json(i = 2): string {
		return JSON.stringify(this.program, null, i);
	}
}