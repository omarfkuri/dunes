import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { Functions } from "firebase/functions";

export abstract class AbstractFire<F extends Firestore | Auth | Functions> {
	constructor(readonly self: F) {}
}
