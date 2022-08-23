#!/usr/bin/env node

import * as Commander from "commander";
import prompts from "prompts";
import path from "path";
import { createPackageJson } from "./helpers/core/createPackage.js";
import { existsSync } from "fs";
import { mkdir } from "./helpers/utils/mkdir.js";
import { cleanUpFiles } from "./helpers/core/cleanUpFiles.js";
import { cloneRepo } from "./helpers/core/cloneRepo.js";
import { selfDestroy, setRoot } from "./helpers/core/selfDestroy.js";
import chalk from "chalk";
import { createEnv } from "./helpers/utils/createEnv.js";
import { dappInfo } from "./interfaces/dappInfo.js";
import { logInstructions } from "./helpers/core/logInstructions.js";

console.log(
	chalk.blue(`
MMMMMMMMMMMMMMMMMK:..:KMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMWO,    ,OWMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMWk'      'kWMMMMMMMMMMMMMM
MMMMMMMMMMMMMMK;        .dNMMMMMMMMMMMMM
MMMMMMMMMMMMMMWk'        .lXMMMMMMMMMMMM
MMMMMMMMMMMKdxNW0;        .cKMMMMMMMMMMM
MMMMMMMMMW0; .cXMK:.        ;0WMMMMMMMMM
MMMMMMMMWk'    :0WXl'.       ,kWMMMMMMMM
MMMMMMMNx.      ,0MNKd.       .xNMMMMMMM
MMMMMMNo.       'OMMMWx'       .oNMMMMMM
MMMMMXc.       ,OWMMMMWO;........dNMMMMM
MMMM0:        :0MMMMMMMMN0OO0OOO0XWMMMMM
MMWO,       .cXMXkxxxxxxxxxxxxxxxxxkKWMM
MWx'       .oNW0;.                  'xWM
Nd.       .xNWk'                     .dN
l.       'kWNx.                       .l
.       .kWM0'                         .
`)
);

console.log("\n");
console.log("🔵 Welcome to the create-web3-dapp wizard 🔵");
console.log("\n");

let projectPath = "";

// Gets project name

// Starts creation process
async function run() {
	let step = 0;
	let quit = false;

	const dappInfo: dappInfo = {
		chain: "",
		isEVM: true,
		isTestnet: false,
		useBackend: false,
		backendProvider: "",
		toolkitType: undefined,
		components: null,
		apiKeys: { alchemy_api_key: "demo" },
	};

	let projectName = "";
	let resolvedProjectPath = "";

	while (!quit) {
		switch (step) {
			case 0:
				try {
					// Checks if project name is provided
					if (typeof projectPath === "string") {
						projectPath = projectPath.trim();
					}
					while (!projectPath) {
						projectPath = await prompts({
							type: "text",
							name: "projectPath",
							message: "Please, insert a project name",
							initial: "my-dapp",
						}).then((data) => data.projectPath);
					}

					//Reformat project's name
					projectPath = projectPath.trim().replace(/[\W_]+/g, "-");

					resolvedProjectPath = path.resolve(projectPath);
					let dirExists: boolean = existsSync(resolvedProjectPath);
					setRoot(resolvedProjectPath);
					
					let i = 1;
					// Check if project
					while (dirExists) {
						projectPath = await prompts({
							type: "text",
							name: "projectPath",
							message:
								"A directory with this name already exists, please use a different name",
							initial: `my-dapp-${i}`,
						}).then((data) =>
							data.projectPath.trim().replace(/[\W_]+/g, "-")
						);
						resolvedProjectPath = path.resolve(projectPath);
						dirExists = existsSync(resolvedProjectPath);
						i += 1;
					}
					projectName = path.basename(resolvedProjectPath);
				} catch (e) {
					selfDestroy(e);
				}
				step++;
				break;
			case 1:
				try {
					const builderTemplate: string = await prompts({
						type: "select",
						name: "builderTemplate",
						message: "Choose how to start:",
						choices: [
							{
								title: "Create a default EVM application",
								value: "evm_app",
							},
							{
								title: "Create a default Solana application",
								value: "sol_app",
							},
							{
								title: "Create a custom application",
								value: "custom",
							},
						],
						initial: 0,
						hint: "- Create a default app ",
					}).then((data) => data.builderTemplate);

					if (builderTemplate == "evm_app") {
						dappInfo.chain = "ethereum";
						dappInfo.isEVM = true;
						dappInfo.isTestnet = true;

						step = 4;
					} else if (builderTemplate == "sol_app") {
						dappInfo.chain = "solana";
						dappInfo.isEVM = false;
						dappInfo.isTestnet = false;

						step = 4;
					} else if ("custom") {
						const chain: string = await prompts({
							type: "select",
							name: "chain",
							message: "For which VM are you building for?",
							choices: [
								{ title: "Ethereum", value: "ethereum" },
								{ title: "Polygon", value: "polygon" },
								{ title: "Artbitrum", value: "arbitrum" },
								{ title: "Optimism", value: "optimism" },
								{ title: "Solana", value: "solana" },
							],
							initial: 0,
							hint: "- This will make sure to copy the right dependencies and template files",
						}).then((data) => (dappInfo.chain = data.chain));

						dappInfo.isEVM =
							chain == "ethereum" ||
							chain == "polygon" ||
							chain == "arbitrum" ||
							chain == "optimism"
								? true
								: false;
						step++;
					}
				} catch (e) {
					selfDestroy(e);
				}
				break;
			case 2:
				try {
					if (
						dappInfo.chain === "ethereum" ||
						dappInfo.chain === "polygon"
					) {
						const isTestnet: boolean = await prompts({
							type: "toggle",
							name: "testnet",
							message: "Do you want to use a testnet?",
							initial: true,
							active: "yes",
							inactive: "no",
							hint: "- You can change it later",
						}).then((data) => data.testnet);
						dappInfo.isTestnet = isTestnet;

						if (isTestnet) {
							switch (dappInfo.chain) {
								case "ethereum":
									dappInfo.testnet = "goerli";
									break;
								case "polygon":
									dappInfo.testnet = "mumbai";
							}
						}
					}
					step++;
				} catch (e) {
					selfDestroy(e);
				}

				break;
			case 3:
				try {
					if (dappInfo.chain !== "solana") {
						await prompts({
							type: "select",
							name: "toolkitType",
							message: "What kind of DApp are you building?",
							choices: [
								{ title: "NFTs", value: "nfts" },
								{ title: "DeFi (coming soon)", value: undefined },
								{
									title: "Governance (coming soon)",
									value: undefined,
								},
								{ title: "Blank", value: undefined },
							],
							initial: 0,
							hint: "- Select Blank to start from scratch",
						}).then(
							(data) => (dappInfo.toolkitType = data.toolkitType)
						);

						if (dappInfo.toolkitType) {
							await prompts({
								type: "multiselect",
								name: "components",
								message: "Import template react components",
								choices: [
									{
										title: "NFTs Gallery",
										value: "nftCard.jsx",
									},
									{
										title: "NTFs Collection Info Panel",
										value: "nftGallery.jsx",
									},
								],
								hint: "- Space to select. Return to submit",
							}).then(
								(data) =>
									(dappInfo.components = data.components)
							);
						}
					}
					step++;
				} catch (e) {
					selfDestroy(e);
				}

				break;
			case 4:
				try {
					if (dappInfo.chain == "solana") {
						await prompts({
							type: "toggle",
							name: "useBackend",
							message: "Do you want to import Anchor?",
							initial: true,
							active: "yes",
							inactive: "no",
							hint: "- This will install the needed dependencies to your project",
						}).then(
							(data) => (dappInfo.useBackend = data.useBackend)
						);
						dappInfo.backendProvider = "anchor";
					} else {
						await prompts({
							type: "toggle",
							name: "useBackend",
							message:
								"Do you want to import a Blockchain development environment? (Hardhat, Foundry)",
							initial: true,
							active: "yes",
							inactive: "no",
							hint: "- This will install the needed dependencies to your project",
						}).then(
							(data) => (dappInfo.useBackend = data.useBackend)
						);
						if (dappInfo.useBackend) {
							await prompts({
								type: "select",
								name: "backendType",
								message:
									"Choose a Blockchain development environment:",
								choices: [
									{ title: "Hardhat", value: "hardhat" },
									{
										title: "Foundry (not yet supported)",
										value: "foundry",
									},
								],
								initial: 0,
							}).then(
								(data) =>
									(dappInfo.backendProvider =
										data.backendType)
							);
						}
					}

					step++;
				} catch (e) {
					selfDestroy(e);
				}

				break;
			case 5:
				try {
					const alchemyAPIKey: string = await prompts({
						type: "text",
						name: "apiKey",
						message:
							"Insert your Alchemy API Key (if none, 'demo' will be used)",
						initial: "demo",
					}).then((data) => data.apiKey);

					dappInfo.apiKeys["alchemy_api_key"] = alchemyAPIKey;
					dappInfo.apiKeys["private_key"] = "none";

					quit = true;
				} catch (e) {
					selfDestroy(e);
				}

				break;
		}
	}

	try {
		mkdir(resolvedProjectPath);
		cloneRepo(resolvedProjectPath, dappInfo);
		createPackageJson(projectName, resolvedProjectPath, dappInfo);
		createEnv(dappInfo.apiKeys, process.cwd());
		cleanUpFiles();
		logInstructions();
	} catch (e) {
		selfDestroy(e);
	}

	// Choose DApp chain to setup RPC url and dependencies

	//TODO: Split in components selection
}

run();
