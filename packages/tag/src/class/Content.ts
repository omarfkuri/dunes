
import type { Thing } from "../types/index.js"


export class Content implements Thing {
	readonly kind = "content"

	constructor(readonly value: unknown) {}

	toString(): string {
		return String(this.value);
	}

}