import path from "path";
import fse from "fs-extra";
import { LogLevel, selfDestroy } from "../core/selfDestroy.js";

export const copyFile = (folder, filename, destination) => {
	try {
		const file = path.join(process.cwd(), "templates", folder, filename);

		if (destination !== process.cwd()) {
			destination = path.join(process.cwd(), destination, filename);
		}
		destination = path.join(destination, filename);

		fse.copySync(file, destination);
	} catch (e) {
		selfDestroy(e, LogLevel.ERROR);
	}
};
