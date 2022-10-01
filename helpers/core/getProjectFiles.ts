import { selfDestroy } from "./selfDestroy.js";
import { execSync } from "child_process";
import path from "path";
import fse from "fs-extra";
import chalk from "chalk";
import cliProgress from "cli-progress";
import { setUpHardhat } from "../backend_helpers/setupHardhat.js";
import { getComponents } from "./getComponents.js";
import { createEnv } from "../utils/createEnv.js";
import { copyFile } from "../utils/copyFile.js";
import { cleanUpFiles } from "../utils/cleanUpFiles.js";
import { Context } from "vm";
import BuilderContext from "../../interfaces/BuilderContext.js";

export const getProjectFiles = ({resolvedProjectPath, dappInfo}:BuilderContext) => {
	try {
		process.chdir(resolvedProjectPath);
		console.log(chalk.yellow("Downloading files..."));
		const bar1 = new cliProgress.SingleBar(
			{},
			cliProgress.Presets.shades_classic
		);
		bar1.start(200, 0);
		console.log("\n");
		execSync(
			`git clone --depth 1 ${"https://github.com/Eversmile12/create-web3-dapp"} .`
		);
		console.log("\n");
		bar1.update(100);

		console.log(chalk.yellow("\nCopying project files..."));

		const template = path.join(
			process.cwd(),
			"templates",
			dappInfo.isEVM
				? "evm"
				: "solana",
			"core"
		);
		if (dappInfo.useBackend) {
			fse.copySync(template, path.join(process.cwd(), "frontend"));
		} else {
			fse.copySync(template, process.cwd());

		}
		if (dappInfo.modules) {
			getComponents(
				dappInfo.modules,
				dappInfo.isEVM,
				dappInfo.useBackend
			);

		}

		bar1.update(200);

		bar1.stop();

		if (dappInfo.useBackend) {
			console.log(
				chalk.yellow(`Copying ${dappInfo.backendProvider} files...`)
			);
			switch (dappInfo.backendProvider) {
				case "hardhat":
					setUpHardhat(dappInfo, resolvedProjectPath);
					break;

				case "foundry":
					break;
				case "Anchor":
					break;
			}
		}

		createEnv({...dappInfo.apiKeys, ETHERSCAN_API_KEY: ""}, dappInfo.useBackend ? path.join(process.cwd(), "frontend") : process.cwd());
		copyFile("utils", "README.md", process.cwd());
		cleanUpFiles(dappInfo.useBackend)
		console.log("Project files copied ✅");
	} catch (e) {
		selfDestroy(e);
	}
};
