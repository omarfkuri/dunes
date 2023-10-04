import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

type Doc = string | string[]

interface Tree {
	[pathname: string]: Doc | Tree
}


export async function buildTree(parent: string, tree: Tree) {
	await mkdir(parent, {recursive: true})
	for (const key in tree) {
		const dirent = tree[key]!;
		const path = join(parent, key);
		
		if (typeof dirent === "object") {
			if (Array.isArray(dirent)) {
				await writeFile(path, dirent.join("\n"));
			}
			else 
				await buildTree(path, dirent);
		}
		else if (typeof dirent === "string") {
			await writeFile(path, dirent);
		}
	}
}