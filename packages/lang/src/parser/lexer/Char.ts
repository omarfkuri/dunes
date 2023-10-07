import { Position } from "./types";

export class Char implements Position {
	constructor(
		public value: string,
		public line: number,
		public column: number
	) {}
}

export class CharList extends Array<Char> {

	constructor(source: string) {
		super();

		let line = 0;
		let column = 0;
		for (const ch of source) {
			this.push(new Char(ch, line, column));	
			if (ch === "\n") {
				line++;
				column = 0;
			}
			else {
				column++;
			}
		}
	}
}