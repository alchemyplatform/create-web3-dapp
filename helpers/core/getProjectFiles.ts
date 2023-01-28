import { selfDestroy } from "./selfDestroy.js";
import { execSync } from "child_process";
import path from "path";
import fse from "fs-extra";
import chalk from "chalk";
import { setUpHardhat } from "../backend_helpers/setupHardhat.js";
import { createEnv } from "../utils/createEnv.js";
import { copyFile } from "../utils/copyFile.js";
import { cleanUpFiles } from "../utils/cleanUpFiles.js";
import BuilderContext from "../../interfaces/BuilderContext.js";
import { getDefaultRainbowkitChain } from "../utils/getDefaultRainbowkitChain.js";
import { Multibar } from "../utils/progressBar.js";

export const getProjectFiles = (
	{ resolvedProjectPath, dappInfo }: BuilderContext,
	progressBar?: any
) => {
	try {
		process.chdir(resolvedProjectPath);
		
		execSync(
			`git clone --depth 1 ${"https://github.com/Eversmile12/create-web3-dapp"} .`
		);
		const template = path.join(
			process.cwd(),
			"templates",
			dappInfo.isEVM ? "evm" : "solana",
			"core"
		);
		if (dappInfo.useBackend) {
			fse.copySync(template, path.join(process.cwd(), "frontend"));
		} else {
			fse.copySync(template, process.cwd());
		}

		// if (dappInfo.modules) {
		// 	getComponents(
		// 		dappInfo.modules,
		// 		dappInfo.isEVM,
		// 		dappInfo.useBackend
		// 	);

		// }

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
			}
		}

		createEnv(
			{
				...dappInfo.apiKeys,
				ALCHEMY_NETWORK: dappInfo.chain,
				NEXT_PUBLIC_DEFAULT_CHAIN: getDefaultRainbowkitChain(
					dappInfo.isTestnet ? dappInfo.testnet! : dappInfo.chain
				),
			},
			dappInfo.useBackend
				? path.join(process.cwd(), "frontend")
				: process.cwd()
		);
		copyFile("utils", "README.md", process.cwd());

		cleanUpFiles(dappInfo.useBackend);
	} catch (e) {
		selfDestroy(e);
	}
};
