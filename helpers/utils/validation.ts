import { existsSync } from "fs";
import path from "path";
import context from "../core/context.js";

export const validateProjectName = (projectPath: string) => {
	const tempPath = projectPath.trim();
	context.resolvedProjectPath = path.resolve(tempPath);
	const dirExists: boolean = existsSync(context.resolvedProjectPath);
	if (!tempPath.length) {
		return "Error: invalid directory name length: name can't be empty\n";
	}
	if (dirExists) {
		return "Error: directory already exists: a directory with this name already exists, please use a different name\n";
	}
	if (projectPath.length >= 214) {
		return "Error: invalid directory name length: name must contain less than 214 characters\n";
	}
	if (containsInvalidChars(projectPath)) {
		return "Error: invalid directory name: name must only include URL-friendly characters\n";
	}

	return true;
};

const containsInvalidChars = (path: string) => {
	const regex = /[.~:/#[\]@$&'()*+,;=%]/g;
	return regex.test(path);
};


