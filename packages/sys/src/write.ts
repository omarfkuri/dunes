import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname } from "path";


export async function writeStr(path: string, content: string) {
	await mkdir(dirname(path), {recursive: true});
	await writeFile(path, content);
}

export async function writeJSON(path: string, content: obj, indent = 2) {
	await writeStr(path, JSON.stringify(content, null, indent));
}

export async function readString(path: string): Promise<string> {
	const buff = await readFile(path);
	return String(buff);
}

export async function readJSON<T extends obj>(path: string): Promise<T> {
	const obj = await readString(path);
	return JSON.parse(obj);
}