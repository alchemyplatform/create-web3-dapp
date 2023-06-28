import chalk from "chalk";
import fs from "fs";
import kill from "../utils/kill.js";
let root = "";
let isVerbose = false;
export const setVerbosity = (_isVerbose: boolean) => (isVerbose = _isVerbose);
export enum LogLevel {
	"MESSAGE" = "message",
	"ERROR" = "error",
}
export const setRoot = (path: string) => {
	root = path;
};

export const selfDestroy = (error?, logLevel: LogLevel = LogLevel.MESSAGE) => {
	if ((error && isVerbose) || logLevel == LogLevel.MESSAGE)
		 console.error(chalk.red(error));
	kill();
	fs.rmSync(root, {
		recursive: true,
		force: true,
	});
	process.exit(1);
};
