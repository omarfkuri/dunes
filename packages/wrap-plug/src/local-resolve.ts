import { dirname, join, resolve } from "path";
import { existsSync } from "fs";

import type { Plugin } from "@dunes/wrap";
import { BabWrap } from "@dunes/bab";
import { ResolveOptions } from "./types";

export function localResolve(opts: ResolveOptions): Plugin {
  const babel = new BabWrap(opts.parseOptions);
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


  return {
    name: "bab",
    transform(source, id) {

      const bab = babel.read(source);

      const filename = id.includes("virtual:script")? opts.id: id;
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
              

              const r = babel.from(path.node).convert(opts.transformOptions(""))?.code;
              if (r) {
                opts.keeps.add(r)
              }

              path.remove();
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
      });

      return bab.convert(opts.transformOptions(filename))?.code || "";
    }
  }
}