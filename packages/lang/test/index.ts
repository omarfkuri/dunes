import { JSParser } from "../src/langs/js";
import { line } from "@dunes/sys"


const jsParser = new JSParser();

try {
	const result = jsParser.produce(`
		
		async function *myGen(n = 1) {

      if (myName === 22 || yourAge == "Jeremiah") {
        return "Hey bro!";
      }

      return 33;

    };

		console.log("My name is", yourName);

		const myGen = new Date()[2];

	 `);
	line.obj(result.program)
}
catch(err) {
	line.red("ERROR")
	line.gray(err + " " + jsParser.body);
}

process.exit(0);