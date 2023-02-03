import fs from "fs";
import path from "path";

export const cleanUpFiles = (useBackend: boolean) => {
	if (useBackend) {
		fs.rmSync(path.join(process.cwd(), "tempBackend"), {
			recursive: true,
			force: true,
		});
		
	} else {
		fs.rmSync(path.join(process.cwd(), "frontend"), {
			recursive: true,
			force: true,
		});
	}
	
};
