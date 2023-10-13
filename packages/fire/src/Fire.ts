import { type FirebaseApp, type FirebaseOptions, initializeApp } from "firebase/app";

type FireAuth = import("./FireAuth.js").FireAuth
declare const FireAuth: typeof import("./FireAuth.js").FireAuth | undefined

type FireData = import("./FireData.js").FireData
declare const FireData: typeof import("./FireData.js").FireData | undefined

type FireStorage = import("./FireStorage.js").FireStorage
declare const FireStorage: typeof import("./FireStorage.js").FireStorage | undefined

type FireFunctions = import("./FireFunctions.js").FireFunctions
declare const FireFunctions: typeof import("./FireFunctions.js").FireFunctions | undefined

export class Fire {
	
	static #app: FirebaseApp;
	static #auth: FireAuth; 
	static #data: FireData; 
	static #storage: FireStorage; 
	static #functions: FireFunctions | null = null;

	static init(firebaseConfig: FirebaseOptions) {
		this.#app = initializeApp(firebaseConfig)
	}

	static useAuth(fireAuth = FireAuth): void {
		if (!this.#app) {
			throw `App is not initialized`
		}
		if (!fireAuth) {
			throw `fireAuth is not imported`
		}
		this.#auth = new fireAuth(this.#app)
	}

	static get auth() {
		return this.#auth;
	}

	static useDatabase(fireData = FireData): void {
		if (!this.#app) {
			throw `App is not initialized`
		}
		if (!fireData) {
			throw `FireData is not imported`
		}
		this.#data = new fireData(this.#app)
	}

	static get data() {
		return this.#data;
	}

	static useStorage(fireStorage = FireStorage): void {
		if (!this.#app) {
			throw `App is not initialized`
		}
		if (!fireStorage) {
			throw `fireStorage is not imported`
		}
		this.#storage = new fireStorage(this.#app)
	}

	static get storage() {
		return this.#storage;
	}

	static useFunctions(fireFunctions = FireFunctions): void {
		if (!this.#app) {
			throw `App is not initialized`
		}
		if (!fireFunctions) {
			throw `fireFunctions is not imported`
		}
		this.#functions = new fireFunctions(this.#app)
	}

	static get functions() {
		return this.#functions;
	}
}


