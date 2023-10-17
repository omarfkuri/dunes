// @ts-nocheck
import type { OnParse } from "../types.js";
import { js } from "@dunes/tools"

export const includeScript: OnParse = async (e) => {
  const scripts: string[] = [];

  e.bab.traverse({
    CallExpression(path) {
      if (path.node.callee.type !== "Identifier") return;
      if (path.node.callee.name !== "include") return;
      if (path.node.arguments.length !== 2) {
        throw "Expected 2 arguments for include call";
      }

      const [imp, func] = path.node.arguments;

      if (!imp || imp.type !== "CallExpression") {
        throw "Expected 'CallExpression' as first arg of include call";
      }
      if (imp.callee.type !== "Import") {
        throw "Expected 'Import' as callee of include first arg";
      }
      if (imp.arguments.length !== 1) {
        throw "Expected one argument in include import";
      }
      const [impPath] = imp.arguments;
      if (!impPath || impPath.type !== "StringLiteral") {
        throw "Expected string literal as import argument";
      }

      if (!func || func.type !== "FunctionExpression" && func.type !== "ArrowFunctionExpression") {
        throw "Expected 'FunctionExpression' as second arg of include call";
      }

      if (func.params.length !== 1) {
        throw "Expected 'FunctionExpression' to have a single param";
      }
      const [funcParam] = func.params;

      if (!funcParam || (
        funcParam.type !== "Identifier" &&
        funcParam.type !== "ObjectPattern"
      )) {
        throw "Expected either 'Identifier' or 'ObjectPattern' as param of include function";
      }

      const imCode = e.babel.from(funcParam).convert({filename: ""})?.code;
      const fnCode = e.babel.from(func).convert({filename: ""})?.code;

      if (!imCode || !fnCode) {
        throw "Include produces empty code";
      }

      scripts.push(
        `import ${imCode} from "${impPath.value}";\n` +
        `const MYRESULT33 = (${fnCode})(${imCode}); MYRESULT33;`
      );
    }
  });

  const includes: unknown[] = [];
  for (const script of scripts) {
    const bundle = await e.bundler.bundleScript(script);
    includes.push(await bundle.evaluate());
  }

  e.bab.traverse({
    CallExpression(path) {
      if (path.node.callee.type !== "Identifier") return;
      if (path.node.callee.name !== "include") return;
      const nBab = e.babel.read(`()=> (${js(includes.shift())})`);
      const [node] = nBab.result.program.body;
      if (!node || node.type !== "ExpressionStatement" || node.expression.type !== "ArrowFunctionExpression") {
        throw "never";
      }
      path.replaceWith(node.expression.body);
    }
  });
}