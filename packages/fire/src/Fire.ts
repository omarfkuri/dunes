import { type FirebaseApp, type FirebaseOptions, initializeApp } from "firebase/app";

type FireAuth = import("./FireAuth").FireAuth
declare const FireAuth: typeof import("./FireAuth").FireAuth | undefined

type FireData = import("./FireData").FireData
declare const FireData: typeof import("./FireData").FireData | undefined

type FireStorage = import("./FireStorage").FireStorage
declare const FireStorage: typeof import("./FireStorage").FireStorage | undefined

type FireFunctions = import("./FireFunctions").FireFunctions
declare const FireFunctions: typeof import("./FireFunctions").FireFunctions | undefined

export class Fire {
	
	static #app: FirebaseApp;
	static #auth: FireAuth; 
	static #data: FireData; 
	static #storage: FireStorage; 
	static #functions: FireFunctions | null = null;

	static init(firebaseConfig: FirebaseOptions) {
		this.#app = initializeApp(firebaseConfig)
	}

	static useAuth(): void {
		if (!this.#app) {
			throw `App is not initialized`
		}
		if (!FireAuth) {
			throw `FireAuth is not imported`
		}
		this.#auth = new FireAuth(this.#app)
	}

	static get auth() {
		return this.#auth;
	}

	static useDatabase(): void {
		if (!this.#app) {
			throw `App is not initialized`
		}
		if (!FireData) {
			throw `FireData is not imported`
		}
		this.#data = new FireData(this.#app)
	}

	static get data() {
		return this.#data;
	}

	static useStorage(): void {
		if (!this.#app) {
			throw `App is not initialized`
		}
		if (!FireStorage) {
			throw `FireData is not imported`
		}
		this.#storage = new FireStorage(this.#app)
	}

	static get storage() {
		return this.#storage;
	}

	static useFunctions(): void {
		if (!this.#app) {
			throw `App is not initialized`
		}
		if (!FireFunctions) {
			throw `FireFunctions is not imported`
		}
		this.#functions = new FireFunctions(this.#app)
	}

	static get functions() {
		return this.#functions;
	}
}


