import { type FirebaseApp } from "firebase/app";
import {
	type Auth, 
	getAuth,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { AbstractFire } from "./AbstractFire";

export class FireAuth extends AbstractFire<Auth> {

	constructor(app: FirebaseApp) {
		super(getAuth(app))
	}

	login(email: string, password: string) {
		return signInWithEmailAndPassword(this.self, email, password);
	}

	signup(email: string, password: string) {
		return signInWithEmailAndPassword(this.self, email, password);
	}
}
