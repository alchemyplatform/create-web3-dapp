import { selfDestroy } from "./selfDestroy.js";
import { execSync } from "child_process";
import path from "path";
import fse from "fs-extra";
import chalk from "chalk";
import cliProgress from "cli-progress";
import { setUpHardhat } from "../backend_helpers/setupHardhat.js";
import { dappInfo } from "../../interfaces/dappInfo.js";
import { getComponents } from "./getComponents.js";
import { createEnv } from "../utils/createEnv.js";
import { copyFile } from "../utils/copyFile.js";
import { cleanUpFiles } from "../utils/cleanUpFiles.js";

export const getProjectFiles = (projectPath: string, dappInfo: dappInfo) => {
	try {
		process.chdir(projectPath);
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
			dappInfo.chain == "ethereum" ||
				dappInfo.chain == "polygon" ||
				dappInfo.chain == "arbitrum" ||
				dappInfo.chain == "optimism"
				? "evm"
				: "solana",
			"core"
		);
		if (dappInfo.useBackend) {
			fse.copySync(template, path.join(process.cwd(), "frontend"));
		} else {
			fse.copySync(template, process.cwd());

		}
		if (dappInfo.toolkitType && dappInfo.modules) {
			console.log("getting components")
			getComponents(
				dappInfo.toolkitType,
				dappInfo.modules,
				dappInfo.isEVM,
				dappInfo.useBackend
			);

			// getHooks()
		}

		bar1.update(200);

		bar1.stop();

		if (dappInfo.useBackend) {
			console.log(
				chalk.yellow(`Copying ${dappInfo.backendProvider} files...`)
			);
			switch (dappInfo.backendProvider) {
				case "hardhat":
					setUpHardhat(dappInfo, projectPath);
					break;

				case "foundry":
					break;
				case "Anchor":
					break;
			}
		}

		createEnv({alchemy_api_key: dappInfo.alchemyAPIKey}, dappInfo.useBackend ? path.join(process.cwd(), "frontend") : process.cwd());
		copyFile("utils", "README.md", process.cwd());
		cleanUpFiles(dappInfo.useBackend)
		console.log("Project files copied ✅");
	} catch (e) {
		selfDestroy(e);
	}
};
