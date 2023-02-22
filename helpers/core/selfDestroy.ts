import fs from "fs";

let root = ""; 
const verbose = true;

export const setRoot = (path: string) => {
	root = path;
};

export const selfDestroy = (e) => {
	if (verbose) console.error(e);
	console.log(e)
	// fs.rmSync(root, {
	// 	recursive: true,
	// 	force: true,
	// });
	process.exit(1);
};

