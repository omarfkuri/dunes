import { type FirebaseApp } from "firebase/app";
import {
	type NextOrObserver,
	type Auth, 
	type User, 

	getAuth,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth";

export class FireAuth {

	readonly auth: Auth;
	constructor(app: FirebaseApp) {
		this.auth = getAuth(app);
	}

	listen(fn: NextOrObserver<User>) {
		return onAuthStateChanged(this.auth, fn);
	}

	logout() {
		return signOut(this.auth);
	}

	login(email: string, password: string) {
		return signInWithEmailAndPassword(this.auth, email, password);
	}

	signup(email: string, password: string) {
		return signInWithEmailAndPassword(this.auth, email, password);
	}
}
