import { existsSync } from "fs";
import { dirname, join, resolve } from "path";
import type { BundlerConfig } from "./types.js";


export const localResolve: BundlerConfig["onParse"] = (bab, _, filename) => {
  const extensions = ["ts", "tsx", "js", "jsx"];

  function makeFile(pastDir: string, src: string): string {
    let fileDir = src;
    
    if (src.match(/^\.{1,2}\//)) {
      fileDir = join(pastDir, src);
    }

    fileDir = resolve(fileDir);

    let fileName: string | null = null;

    for (const ext of extensions) {
      const joined = `${fileDir}.${ext}`;
      if (existsSync(joined)) {
        fileName = joined;
        break;
      }
      const indexJoined = `${fileDir}/index.${ext}`;
      if (existsSync(indexJoined)) {
        fileName = indexJoined;
        break;
      }
    }
    if (!fileName) {
      return src;
    }

    return fileName;
  }
  
  const pastDir = dirname(filename);

  bab.traverse({
    ImportDeclaration(path) {
      if (path.node.leadingComments) {
        const comment = path.node.leadingComments[path.node.leadingComments.length-1];
        if (comment && comment.value.match(/\s*@keep\s*/)) {
          if (path.node.leadingComments?.length) {
            path.node.leadingComments = path.node.leadingComments.filter(e => e && !e.value.match(/\s*@keep\s*/))
          }
          if (path.node.trailingComments?.length) {
            path.node.trailingComments = path.node.trailingComments.filter(e => e && !e.value.match(/\s*@keep\s*/))
          }
          return;
        }
      }
      if (path.node.source.type == "StringLiteral") {
        path.node.source.value = makeFile(pastDir, path.node.source.value);
      }
    },
    ExportDeclaration(path) {
      if (path.node.type == "ExportAllDeclaration") {
        path.node.source.value = makeFile(pastDir, path.node.source.value);
      }
      else if (path.node.type == "ExportNamedDeclaration") {
        if (path.node.source?.type == "StringLiteral") {
          path.node.source.value = makeFile(pastDir, path.node.source.value);
        }
      }
      else if (path.node.declaration.type == "StringLiteral") {
        path.node.declaration.value = makeFile(pastDir, path.node.declaration.value);
      }
    }
  })
}