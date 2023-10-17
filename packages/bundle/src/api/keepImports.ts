import type { OnParse } from "../types.js";


export const keepImports: OnParse = (e) => {
  e.traverse(e.ast, {
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
    },
  })
}