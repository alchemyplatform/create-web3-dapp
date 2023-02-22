import { existsSync } from "fs";
import path from "path";
import context from "../core/context.js";

export const validateProjectName = (projectPath: string) => {
	const tempPath = projectPath.trim();
	context.resolvedProjectPath = path.resolve(tempPath);
	const dirExists: boolean = existsSync(context.resolvedProjectPath);
	if (!tempPath.length) {
		return "Invalid directory name length: name can't be empty";
	}
	if (dirExists) {
		return "Directory already exists: a directory with this name already exists, please use a different name";
	}
	if (projectPath.length >= 214) {
		return "Invalid directory name length: name must contain less than 214 characters";
	}
	if (containsInvalidChars(projectPath)) {
		return "Invalid directory name: name must only include URL-friendly characters";
	}

	return true;
};

const containsInvalidChars = (path: string) => {
	const regex = /[.~:/#[\]@$&'()*+,;=%]/g;
	return regex.test(path);
};
