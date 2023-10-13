import { AbstractFire } from "./AbstractFire.js";
import { type FirebaseApp } from "firebase/app";
import { 
	type FirebaseStorage,
	type StorageReference,
	type UploadTaskSnapshot,
  type ListOptions,

	getStorage,
	deleteObject,
	ref, uploadBytesResumable, getDownloadURL, listAll, list, StorageError,
} from "firebase/storage";


export class FireStorage extends AbstractFire<FirebaseStorage> {

	constructor(app: FirebaseApp) {
		super(getStorage(app))
	}

	/** 
	 * Create a reference with an initial file path and name
	 * */
	path(path: string): StorageReference {
		return ref(this.self, path)
	}

	/** 
	 * Create a reference from a Google Cloud Storage URI 
	 * */
	gs(path: string): StorageReference {
		return ref(this.self, `gs://bucket/${path}`);
	}

	/**
	 * Create a reference from an HTTPS URL
	 * Note that in the URL, characters are URL escaped! 
	 * */
	http(path: string): StorageReference {
		return ref(this.self, `https://firebasestorage.googleapis.com/b/bucket/o/${encodeURI(path)}`);
	}

	/**
	 * Upload a file
	 * */
	upload(file: File, stRef: StorageReference, onChange?: {(progress: number, snapshot: UploadTaskSnapshot): void}): Promise<UploadTaskSnapshot> {	
		return new Promise<UploadTaskSnapshot>((res, rej) => {
			const uploadTask = uploadBytesResumable(stRef, file);

			uploadTask.on('state_changed', 
				(snapshot) => onChange?.(
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100, 
					snapshot
				),
				rej,
				() => res(uploadTask.snapshot)
			);
		})
	}

	/**
	 * Upload multiple files
	 * */
	uploadAll(files: FileList, path: string, opts: {
		onChange?: {(progress: number, snapshot: UploadTaskSnapshot): void}
		onFileChange?: {(file: File): void}
	} = {}): Promise<{
		tasks: UploadTaskSnapshot[]
		errors: StorageError[]
	}> {
		return new Promise(async res => {
			const tasks: UploadTaskSnapshot[] = [];
			const errors: StorageError[] = [];
			for (const file of files) {
				opts.onFileChange?.(file);
				try {
					const res = await this.upload(file, this.path(`${path}/${Date.now()}`), opts.onChange);
					tasks.push(res);
				}
				catch(error) {
					errors.push(error as StorageError);
				}
				tasks.push();
			}
			res({tasks, errors})
		})
	}

	/**
	 * Get URL of object */
	url(stRef: StorageReference) {
		return getDownloadURL(stRef);
	}

	/**
	 * Delete an object
	 * */
	rem(stRef: StorageReference) {
		return deleteObject(stRef);
	}

	/**
	 * List directory
	 * */
	list(stRef: StorageReference) {
		return listAll(stRef);
	}

	/**
	 * List directory with options
	 * */
	listPages(stRef: StorageReference, options: ListOptions) {
		return list(stRef, options);
	}
}
