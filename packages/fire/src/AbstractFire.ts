import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { Functions } from "firebase/functions";
import type { FirebaseStorage } from "firebase/storage";

export abstract class AbstractFire<F extends (
	| FirebaseStorage 
	| Firestore 
	| Auth 
	| Functions
)> {
	constructor(readonly self: F) {}
}
