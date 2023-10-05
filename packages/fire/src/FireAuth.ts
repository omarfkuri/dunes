import { type FirebaseApp } from "firebase/app";
import {
	type Auth, 
	initializeAuth,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { AbstractFire } from "./AbstractFire";

export class FireAuth extends AbstractFire<Auth> {

	constructor(app: FirebaseApp) {
		super(initializeAuth(app))
	}

	login(email: string, password: string) {
		return signInWithEmailAndPassword(this.self, email, password);
	}

	signup(email: string, password: string) {
		return signInWithEmailAndPassword(this.self, email, password);
	}
}
