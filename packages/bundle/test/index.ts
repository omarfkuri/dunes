

import { Bundler } from "../src/index.js"



const bundler = new Bundler({
  jsx: {
    pragma: "Elem.create"
  },
  
  onLoad(source) {
    return {
      text: source.replace(/let \w+\$\d+ = /g, "")
    }
  },

  onConclude(source) {
    return source
    .replace(/export *{ .+ };? *\n*/, "")
  },
});

const bundle = await bundler.bundleScript(`

  import { extract } from "@dunes/tools";

  let Elem$1 = class Elem {}

  const n: 22 = <div>Hola!</div>;

  export default (extract(n, 3));
`);

const code = await bundle.code();

console.log(code)

process.exit(0)
