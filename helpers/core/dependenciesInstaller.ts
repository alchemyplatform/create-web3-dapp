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
		const {
			chain,
			testnet,
			isEVM,
			useBackend,
			backendProvider,
			hasSmartContract,
			isTestnet,
		} = dappInfo;

		generatePackageDotJson(
			projectName,
			isEVM,
			isTestnet,
			testnet,
			useBackend,
			backendProvider,
			hasSmartContract,
			chain,
			contractInfo?.name
		);
		if (useBackend) {
			process.chdir("backend");
			execSync("npx npm-check-updates -u");
			execSync("npm install");
		}

		if (useBackend) {
			process.chdir(path.join(resolvedProjectPath, "frontend"));
		} else {
			process.chdir(resolvedProjectPath);
		}

		execSync("npx npm-check-updates -u");
		execSync("npm install");
		process.chdir(resolvedProjectPath);
	} catch (e) {
		selfDestroy(e);
	}
};
