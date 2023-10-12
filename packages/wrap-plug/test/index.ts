import { Wrap } from "@dunes/wrap";
import { ResolveOptions, localResolve } from "../src"
import { jsxPreset, tsPreset } from "@dunes/bab";
import nodeResolve from "@rollup/plugin-node-resolve";
import { transformInclude } from "../src/transformInclude";

const localResOpts: ResolveOptions = {
  id: "test.ts",
  keeps: new Set,
  parseOptions: {
    sourceType: "module",
    plugins: [
      "typescript", "jsx"
    ]
  },
  transformOptions(id) {
    return {
      filename: id,
      presets: [
        jsxPreset({
          pragma: "Elem.create"
        }),
        tsPreset({})
      ]
    }
  },
}

try {
  await Wrap.build({
    source: "test/test.tsx",
    transform: [
      transformInclude(localResOpts)
    ],
    plugs: [
      localResolve(localResOpts),
      nodeResolve()
    ],
    outFile: "test/bundle.js"
  });

}
catch(error) {
  console.log(error);
}
process.exit();