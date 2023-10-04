import type { firestore } from "firebase-admin";
import "@dunes/tools";

/**
 * Adds properties present in every Firebase document
 * */
export type TimeDoc<T> = T & {
	createdAt: firestore.Timestamp
	updatedAt: firestore.Timestamp
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