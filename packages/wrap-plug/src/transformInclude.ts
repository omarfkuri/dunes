import { Wrap, type Act, type StringOpts, act, FileOpts } from "@dunes/wrap";
import { BabWrap } from "@dunes/bab";
import { ResolveOptions } from "./types";
import { js } from "@dunes/tools";
import { ScriptTarget } from "typescript";

export function transformInclude(opts: ResolveOptions) {
  const babel = new BabWrap(opts.parseOptions);

  return act({
    name: "include",
    match: /\.tsx?$/,
    async action(source, id, wrOpts) {
      const bab = babel.read(source);
      const filename = id.includes("virtual:script") ? opts.id : id;

      const includeStrings: string[] = [];

      bab.traverse({
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

          const imCode = babel.from(funcParam).convert(opts.transformOptions(""))?.code;
          const fnCode = babel.from(func).convert(opts.transformOptions(""))?.code;

          if (!imCode || !fnCode) {
            throw "Include roduces empty code";
          }

          includeStrings.push(
            `import ${imCode} from "${impPath.value}";\n` +
            `const MYRESULT33 = (${fnCode})(${imCode}); MYRESULT33;`
          );
        }
      });

      const includes: unknown[] = [];
      for (const script of includeStrings) {
        const {
          outFile,
          source,
          ...opts} = wrOpts as any
        opts.script = script
        const build = await Wrap.build(opts);
        includes.push(eval(build.code));
      }

      bab.traverse({
        CallExpression(path) {
          if (path.node.callee.type !== "Identifier") return;
          if (path.node.callee.name !== "include") return;
          const nBab = babel.read(`()=> (${js(includes.shift())})`);
          const [node] = nBab.result.program.body;
          if (!node || node.type !== "ExpressionStatement" || node.expression.type !== "ArrowFunctionExpression") {
            throw "never";
          }
          path.replaceWith(node.expression.body);
        }
      });

      return {
        text: bab.convert(opts.transformOptions(filename))?.code || ""
      };
    }
  });
}
