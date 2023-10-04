import { Acts } from "@dunes/wrap";
import { Handler } from "../types";


/** Declare a locally scoped handler */
export function handler<A extends Acts>(h: Handler<A>) {
	return h;
}