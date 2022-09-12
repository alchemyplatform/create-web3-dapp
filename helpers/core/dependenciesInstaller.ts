import fs from "fs";
import { execSync } from "child_process";
import chalk from "chalk";
import cliProgress from "cli-progress";
import { selfDestroy } from "./selfDestroy.js";
import path from "path";
import { generatePackageDotJson } from "../utils/generatePackageDotJson.js";
interface packageData {
	isEVM: boolean;
	useBackend: boolean;
	backendProvider?: string;
}

export const installDependencies = async (
	projectName: string,
	resolvedProjectPath,
	{ isEVM, useBackend, backendProvider = "" }: packageData
) => {
	try {
		

		generatePackageDotJson(projectName, isEVM, useBackend, backendProvider);
		// TODO: IMPLEMENT OTHER PROVIDERS
		if (backendProvider == "hardhat") {
			console.log(`Installing ${backendProvider.charAt(0).toUpperCase() + backendProvider.slice(1)} dependencies...`)
			const bar1 = new cliProgress.SingleBar(
				{},
				cliProgress.Presets.shades_classic
			);
			bar1.start(100, 0);
			process.chdir("backend");
			bar1.update(50);
			execSync("npx npm-check-updates -u");
			execSync("npm install --loglevel=error");
			bar1.update(100);
			console.log("\nHardhat dependencies installed ✅");
			bar1.stop();

		}
		const bar2 = new cliProgress.SingleBar(
			{},
			cliProgress.Presets.shades_classic
		);
		bar2.start(100, 0);
		if (useBackend) {
			process.chdir(path.join(resolvedProjectPath, "frontend"));
		} else {
			process.chdir(resolvedProjectPath);
		}
		console.log(chalk.yellow("\nChecking dependencies for updates..."));
		execSync("npx npm-check-updates -u");
		bar2.update(50);
		console.log(chalk.yellow("\n Installing other dependencies..."));
		execSync("npm install --loglevel=error");
		bar2.update(200);
		console.log(chalk.green("Dependencies installed ✅"));
		bar2.stop();
		process.chdir(resolvedProjectPath);


	} catch (e) {
		selfDestroy(e);
	}
};


