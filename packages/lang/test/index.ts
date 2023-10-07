import { JSParser } from "./parser";


const jsParser = new JSParser();

try {
	const result = jsParser.produce("let ayArraY-_ = [1, 2, 3, 4];");
	console.log(result.json());
}
catch(err) {
	console.log("ERROR")
	console.warn(err);
}

process.exit(0);