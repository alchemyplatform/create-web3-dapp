import { execSync } from "child_process";
import chalk from "chalk";
import { selfDestroy } from "./selfDestroy.js";
import path from "path";
import { generatePackageDotJson } from "../utils/generatePackageDotJson.js";
import { BuilderContext } from "../../interfaces/BuilderContext";
export const installDependencies = async ({
	dappInfo,
	contractInfo,
	projectName,
	resolvedProjectPath,
}: BuilderContext) => {
	try {
		const { isEVM, useBackend, backendProvider, hasSmartContract } =
			dappInfo;

		generatePackageDotJson(
			projectName,
			isEVM,
			useBackend,
			backendProvider,
			hasSmartContract,
			contractInfo?.name
		);
		if (backendProvider == "hardhat") {
			// console.log(
			// 	`Installing ${
			// 		backendProvider.charAt(0).toUpperCase() +
			// 		backendProvider.slice(1)
			// 	} dependencies...`
			// );

			process.chdir("backend");
			execSync("npx npm-check-updates -u");
			execSync("npm install --loglevel=error");
		}

		if (useBackend) {
			process.chdir(path.join(resolvedProjectPath, "frontend"));
		} else {
			process.chdir(resolvedProjectPath);
		}
	
		execSync("npx npm-check-updates -u");
		execSync("npm install --loglevel=error");
		process.chdir(resolvedProjectPath);
	} catch (e) {
		selfDestroy(e);
	}
};
