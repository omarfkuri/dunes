import { FirebaseApp } from "firebase/app";
import {
	type HttpsCallable,
	type Functions,
	getFunctions,
	httpsCallable,
} from "firebase/functions";
import { AbstractFire } from "./AbstractFire";

export class FireFunctions extends AbstractFire<Functions> {

	constructor(app: FirebaseApp) {
		super(getFunctions(app))
	}

	getFn<N, R>(name: string): HttpsCallable<N, R> {
		return httpsCallable<N, R>(this.self, name);
	}

	async function<N, R>(name: string, obj: N): Promise<R> {
		const { data } = await httpsCallable<N, R>(this.self, name)(obj);
		return data;
	}
}
