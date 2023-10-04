import { type FirebaseApp } from "firebase/app";
import {
	type CollectionReference, 
	type DocumentReference,
	type Query, 
	type QueryConstraint, 
	type Firestore,

	collection, doc, getDoc,
	getDocs, getFirestore,
	onSnapshot, query, where, setDoc, updateDoc, AddPrefixToKeys, 
} from "firebase/firestore";
import type { Doc, DocFn } from "./types";

export class FireStore {

	readonly store: Firestore;
	constructor(app: FirebaseApp) {
		this.store = getFirestore(app);
	}

	onDocs<T>(colRef: Query<T> | CollectionReference<T>, docFn: DocFn<T>) {
		return onSnapshot(colRef, (snap) => {
			const docs = snap.docs.map(x => ({ ...x.data(), id: x.id })) as Doc<T>[];
			return docFn(docs);
		});
	}

	where(...args: Parameters<typeof where>) {
		return where(...args);
	}

	doc<T>(from: string, docID: string): DocumentReference<T> {
		return doc(this.store, from, docID) as DocumentReference<T>;
	}

	col<T>(from: string): CollectionReference<T> {
		return collection(this.store, from) as CollectionReference<T>;
	}

	colWhere<T>(from: string, ...queries: QueryConstraint[]): Query<T> {
		return query(collection(this.store, from), ...queries) as Query<T>;
	}

	async getDoc<T>(docRef: DocumentReference<T>): Promise<Doc<T> | null> {
		const siteDoc = await getDoc(docRef);
		if (!siteDoc.exists()) {
			return null;
		}
		return { ...siteDoc.data()!, id: siteDoc.id } as Doc<T>;
	}

	async getCollection<T>(colRef: CollectionReference<T> | Query<T>): Promise<Doc<T>[]> {
		const p = new Array<Doc<T>>();

		const ref = await getDocs(colRef);

		for (const x of ref.docs) {
			p.push(({ ...x.data(), id: x.id }) as Doc<T>);
		}

		return p;
	}

	setDoc<T>(docRef: DocumentReference<T>, doc: T): Promise<void> {
		return setDoc(docRef, doc);
	}

	updateDoc<T>(docRef: DocumentReference<T>, doc: Partial<T>): Promise<void> {
		return updateDoc(docRef, doc);
	}
}
