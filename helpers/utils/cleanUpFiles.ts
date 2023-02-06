import fs from "fs";
import path from "path";

export const cleanUpFiles = (useBackend: boolean) => {
	fs.rmSync(path.join(process.cwd(), ".git"), {
		recursive: true,
		force: true,
	});
	if (useBackend) {
		fs.rmSync(path.join(process.cwd(), "tempBackend"), {
			recursive: true,
			force: true,
		});
		fs.rmSync(path.join(process.cwd(), "backend", ".git"), {
			recursive: true,
			force: true,
		});
		fs.rmSync(path.join(process.cwd(), "frontend", ".git"), {
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
