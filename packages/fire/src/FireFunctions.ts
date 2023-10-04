import { FirebaseApp } from "firebase/app";
import {
	type HttpsCallable,
	type Functions,
	getFunctions,
	httpsCallable,
} from "firebase/functions";

export class FireFunctions {

	readonly functions: Functions;
	constructor(app: FirebaseApp) {
		this.functions = getFunctions(app);
	}

	getFn<N, R>(name: string): HttpsCallable<N, R> {
		return httpsCallable<N, R>(this.functions, name);
	}

	async function<N, R>(name: string, obj: N): Promise<R> {
		const { data } = await httpsCallable<N, R>(this.functions, name)(obj);
		return data;
	}
}
