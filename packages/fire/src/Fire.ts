import { type FirebaseApp, type FirebaseOptions, initializeApp } from "firebase/app";

type FireAuth = import("./FireAuth").FireAuth
declare const FireAuth: typeof import("./FireAuth").FireAuth | undefined

type FireStore = import("./FireStore").FireStore
declare const FireStore: typeof import("./FireStore").FireStore | undefined

type FireFunctions = import("./FireFunctions").FireFunctions
declare const FireFunctions: typeof import("./FireFunctions").FireFunctions | undefined

export class Fire {
	
	static #app: FirebaseApp | null = null;
	static #auth: FireAuth | null = null; 
	static #store: FireStore | null = null; 
	static #fns: FireFunctions | null = null;

	static init(firebaseConfig: FirebaseOptions) {
		this.#app = initializeApp(firebaseConfig)
	}

	static get auth() {
		if (this.#auth) {
			return this.#auth;
		}
		if (!this.#app) {
			throw `App is not initialized`
		}
		if (!FireAuth) {
			throw `FireAuth is not imported`
		}
		this.#auth = new FireAuth(this.#app)
		return this.#auth;
	}

	static get store() {
		if (this.#store) {
			return this.#store;
		}
		if (!this.#app) {
			throw `App is not initialized`
		}
		if (!FireStore) {
			throw `FireStore is not imported`
		}
		this.#store = new FireStore(this.#app)
		return this.#store;
	}

	static get functions() {
		if (this.#fns) {
			return this.#fns;
		}
		if (!this.#app) {
			throw `App is not initialized`
		}
		if (!FireFunctions) {
			throw `FireFunctions is not imported`
		}
		this.#fns = new FireFunctions(this.#app)
		return this.#fns;
	}
}


