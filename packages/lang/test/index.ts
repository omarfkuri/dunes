import { js } from "@dunes/tools";
import { JSParser } from "../src/langs/js";
import { line } from "@dunes/sys"


const jsParser = new JSParser();

try {
	const result = jsParser.produce(`

    const n = 88, [myVar, {user = 22}] = 22;

	 `);

  line.obj(result.program)
}
catch(err) {
	line.red("ERROR")
	line.gray(err + " " + js(jsParser.body));
}

/* Cannot use keyword as member expression */
/* Destructuring */

process.exit(0);