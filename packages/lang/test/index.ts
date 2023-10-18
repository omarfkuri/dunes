import { js } from "@dunes/tools";
import { JSParser } from "../src/langs/js/index.js";
// import { c } from "@dunes/sys"


const jsParser = new JSParser();

// @ts-ignore
// const [[[a = function([{n, s}] = 2) {}, s]]] = 2, r = 3;

try {
	const result = jsParser.produce(`

  const myFunc = function() {


    return this.myFunc();
  };

	 `);

  console.log(js(result.program))
}
catch(err) {
	console.log("ERROR")
	console.log(err + " " + js(jsParser.body));
}

/* Cannot use keyword as member expression */
/* Destructuring */

process.exit(0);