import "@dunes/tools";
import { FieldValue } from "firebase/firestore";

/**
 * Adds time properties present in every Firebase document
 * For things with firebase functions
 * */
export type TimeDoc<T> = T & {
	createdAt: import("firebase/firestore").Timestamp
	updatedAt: import("firebase/firestore").Timestamp
}

/**
 * Adds time properties present in every Firebase document
 * */
export type AdminTimeDoc<T> = T & {
	createdAt: import("firebase-admin").firestore.Timestamp
	updatedAt: import("firebase-admin").firestore.Timestamp
}

/**
 * Adds properties present in every Firebase document with id
 * For things with firebase functions
 * */
export type AdminDoc<T> = AdminTimeDoc<T> & {
	id: string
}

/**
 * Adds properties present in every Firebase document with id
 * */
export type Doc<T> = TimeDoc<T> & {
	id: string
}

/**
 * Function of array of documents
 * */
export type DocFn<T> = ArrayFn<Doc<T>>

/**
 * Basic Response Object
 * */
export type Res = (
	{
		ok: true
	}
	|
	{
		ok: false
		error: unknown
	}
)


/**
 * Response Object with Data
 * */
export type ResData<T = unknown> = (
	{
		ok: true
		data: Doc<T>
	}
	|
	{
		ok: false
		error: unknown
	}
)

/**
 * Defines an object to be passed to set an item in a database
 * */
export type SetDoc<T> = {
	[key in keyof Omit<Doc<T>, "id">]: Doc<T>[key] | FieldValue;
}