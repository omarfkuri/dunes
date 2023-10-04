import { Dirent } from "fs";
import { readdir } from "fs/promises";
import { join } from "path";

export interface Traverser {
  onFile?: (parent: string, file: Dirent, depth: number) => Promise<void> | void
  onFolder?: (parent: string, folder: Dirent, depth: number) => Promise<void> | void
  allowHidden?: boolean
}


export async function trav(src: string, traverser: Traverser, parent = "", depth = 0) {
  for (const file of await readdir(join(src, parent), { withFileTypes: true })) {
    if (file.isFile() && !file.name.startsWith("."))
      await traverser.onFile?.(parent, file, depth);
    else if (file.isDirectory()) {
      await traverser.onFolder?.(parent, file, depth);
      await trav(src, traverser, join(parent, file.name), depth+1);
    }
  }
}