#!/usr/bin/env node
import prompts from "prompts";
import path from "path";
import { installDependencies } from "./helpers/core/dependenciesInstaller.js";
import { existsSync } from "fs";
import { mkdir } from "./helpers/utils/mkdir.js";
import { getProjectFiles } from "./helpers/core/getProjectFiles.js";
import { selfDestroy, setRoot } from "./helpers/core/selfDestroy.js";
import chalk from "chalk";
import { logInstructions } from "./helpers/core/logInstructions.js";
import context from "./helpers/core/context.js";

import { checkNewPackageUpdates } from "./helpers/utils/checkNewPackageUpdates.js";

import { smartContractWizard } from "./helpers/smartContractsWizard/smartContractWizard.js";
import { buildSmartContract } from "./helpers/smartContractsWizard/smartContractBuilder.js";
import {
	getModulesInCathegory,
	getSelectedModules,
	selectModulesInCathegory,
} from "./helpers/utils/getModulesInCathegory.js";

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

	await checkNewPackageUpdates();

	while (!quit) {
		switch (step) {
			case 0:
				try {
					projectPath = "";
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
					context.resolvedProjectPath = path.resolve(projectPath);
					let dirExists: boolean = existsSync(
						context.resolvedProjectPath
					);

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
						context.resolvedProjectPath = path.resolve(projectPath);
						dirExists = existsSync(context.resolvedProjectPath);
						i += 1;
					}
					context.projectName = path.basename(
						context.resolvedProjectPath
					);
					setRoot(context.resolvedProjectPath);
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
							{
								title: "Back",
								value: "back",
							},
						],
						initial: 0,
						hint: "- Create a default app ",
					}).then((data) => data.builderTemplate);

					if (builderTemplate == "evm_app") {
						context.dappInfo.chain = "ETH_MAINNET";
						context.dappInfo.isEVM = true;
						context.dappInfo.isTestnet = true;
						context.dappInfo.testnet = "ETH_GOERLI";

						step = 5;
					} else if (builderTemplate == "sol_app") {
						context.dappInfo.chain = "SOL_MAINNET";
						context.dappInfo.isEVM = false;
						context.dappInfo.isTestnet = false;
						context.dappInfo.testnet = "SOL_DEVNET";

						step = 5;
					} else if (builderTemplate == "custom") {
						step++;
						break;
					} else if (builderTemplate == "back") {
						step--;
						break;
					}
				} catch (e) {
					selfDestroy(e);
				}
				break;
			case 2:
				await prompts({
					type: "select",
					name: "chain",
					message: "For which VM are you building for?",
					choices: [
						{ title: "Ethereum", value: "ETH_MAINNET" },
						{ title: "Polygon", value: "MATIC_MAINNET" },
						{ title: "Artbitrum", value: "ARB_MAINNET" },
						{ title: "Optimism", value: "OPT_MAINNET" },
						{ title: "Solana", value: "SOL_MAINNET" },
						{ title: "Back", value: "back" },
					],
					initial: 0,
					hint: "- This will make sure to copy the right dependencies and template files",
				}).then((data) => (context.dappInfo.chain = data.chain));
				if (context.dappInfo.chain == "back") {
					step--;
					break;
				}

				context.dappInfo.isEVM =
					context.dappInfo.chain == "ETH_MAINNET" ||
					context.dappInfo.chain == "MATIC_MAINNET" ||
					context.dappInfo.chain == "ARB_MAINNET" ||
					context.dappInfo.chain == "OPT_MAINNET" ||
					context.dappInfo.chain == "SOL_MAINNET"
						? true
						: false;
				step++;
				break;

			case 3:
				try {
					const isTestnet: boolean | string = await prompts({
						type: "select",
						name: "testnet",
						message: "Do you want to use a testnet?",
						choices: [
							{
								title: "Yes",
								value: true,
							},
							{ title: "No", value: false },
							{ title: "Back", value: "back" },
						],
						initial: 0,
						hint: "- You can change it later",
					}).then((data) => data.testnet);
					if (typeof isTestnet == "string") {
						step--;
						break;
					} else {
						context.dappInfo.isTestnet = isTestnet;
						if (isTestnet) {
							switch (context.dappInfo.chain) {
								case "ETH_MAINNET":
									context.dappInfo.testnet = "ETH_GOERLI";
									break;

								case "MATIC_MAINNET":
									context.dappInfo.testnet = "MATIC_MUMBAI";
									break;
								case "ARB_MAINNET":
									context.dappInfo.testnet = "ARB_GOERLI";
									break;
								case "OPT_MAINNET":
									context.dappInfo.testnet = "OPT_GOERLI";
									break;
								case "SOL_MAINNET":
									context.dappInfo.testnet = "SOL_GOERLI";
							}
						}
					}

					step++;
				} catch (e) {
					selfDestroy(e);
				}

				break;
			case 4:
				try {
					if (context.dappInfo.chain !== "SOL_MAINNET") {
						const componentCathegory = await prompts({
							type: "select",
							name: "toolkitType",
							message: "Select a components cathegory",
							choices: [
								{ title: "NFTs", value: "nfts" },
								{ title: "Utils", value: "utils" },
								{
									title: "DeFi (coming soon)",
									value: undefined,
									disabled: true,
								},
								{
									title: "Governance (coming soon)",
									value: undefined,
									disabled: true,
								},
								{ title: "Blank", value: "blank" },
								{ title: "Back", value: "back" },
							],
							initial: 0,
							hint: "- Select Blank to start from scratch",
						}).then((data) => data.toolkitType);

						if (
							componentCathegory &&
							typeof componentCathegory === "string"
						) {
							if (componentCathegory == "back") {
								step--;
								break;
							}
							if (componentCathegory == "blank") {
								context.dappInfo.modules = getSelectedModules();
								console.log(context.dappInfo.modules);
								step++;
								break;
							}

							const modules =
								getModulesInCathegory(componentCathegory);

							const selectedModules = await prompts({
								type: "multiselect",
								name: "modules",
								message: "Select the components to import",
								choices: [...modules],
								hint: "- Space to select. Return to submit",
							}).then((data) => data.modules);

							if (selectedModules) {
								selectModulesInCathegory(
									componentCathegory,
									selectedModules
								);
							}

							const continueComponentSelection = await prompts({
								type: "toggle",
								name: "continueComponentSelection",
								message: "Continue the components selection?",
								initial: true,
								active: "yes",
								inactive: "no",
							}).then((data) => data.continueComponentSelection);

							if (!continueComponentSelection) {
								context.dappInfo.modules = getSelectedModules();
								console.log(context.dappInfo.modules);
								step++;
								break;
							} else {
								break;
							}
						}
					} else {
						step++;
						break;
					}
				} catch (e) {
					selfDestroy(e);
				}

				break;
			case 5:
				try {
					let useBackend;
					if (context.dappInfo.chain == "SOL_MAINNET") {
						useBackend = await prompts({
							type: "select",
							name: "useBackend",
							message: "Do you want to import Anchor?",
							choices: [
								{
									title: "Yes",
									description:
									"It will install the needed dependencies",
									value: true,
								},
								{ title: "No", value: false },
								{ title: "Back", value: "back" },
							],
							initial: 0,
							hint: "- Used to compile, deploy, and test smart contracts.",
						}).then((data) => data.useBackend);
						if (typeof useBackend == "string") {
							console.log("going back");
							step = step - 2;
							break;
						}
						context.dappInfo.backendProvider = "anchor";
					} else {
						useBackend = await prompts({
							type: "select",
							name: "useBackend",
							message:
								"Do you want to import a Blockchain development environment? (Hardhat, Foundry)",
							choices: [
								{
									title: "Yes",
									description:
										"It will install the needed dependencies",
									value: true,
								},
								{ title: "No", value: false },
								{ title: "Back", value: "back" },
							],
							initial: 0,
							hint: "- Used to compile, deploy, and test smart contracts.",
						}).then((data) => data.useBackend);
						if (typeof useBackend == "string") {
							step--;
							break;
						}
						context.dappInfo.useBackend = useBackend;

						if (context.dappInfo.useBackend) {
							const backendProvider = await prompts({
								type: "select",
								name: "backendProvider",
								message:
									"Choose a Blockchain development environment:",
								choices: [
									{ title: "Hardhat", value: "hardhat" },
									{
										title: "Foundry (not yet supported)",
										value: "foundry",
										disabled: true,
									},
									{ title: "Back", value: "back" },
								],
								initial: 0,
							}).then((data) => data.backendProvider);
							if (backendProvider == "back") {
								break;
							}
							context.dappInfo.backendProvider = backendProvider;

							const hasContract: boolean = await prompts({
								type: "select",
								name: "hasContract",
								message:
									"Do you want to create a new contract?",
								choices: [
									{
										title: "Yes",
										description:
											"This will start the smart contract creation wizard",
										value: true,
									},
									{ title: "No", value: false },
									{ title: "Back", value: "back" },
								],
								initial: 0,
								hint: "- Create smart contracts directly from the CLI.",
							}).then((data) => data.hasContract);

							if (typeof hasContract == "string") {
								step--;
								break;
							}
							context.dappInfo.hasSmartContract = hasContract;
							if (hasContract) {
								context.contractInfo =
									await smartContractWizard();
							}
						}
					}

					step++;
				} catch (e) {
					selfDestroy(e);
				}

				break;
			case 6:
				try {
					const alchemyAPIKey: string = await prompts({
						type: "text",
						name: "apiKey",
						message:
							"Insert your Alchemy API Key or create an account at https://alchemy.com/?a=create-web3-dapp ",
						initial: "demo",
					}).then((data) => data.apiKey);

					context.dappInfo.apiKeys.ALCHEMY_API_KEY = alchemyAPIKey;

					quit = true;
				} catch (e) {
					selfDestroy(e);
				}

				break;
		}
	}

	try {
		mkdir(context.resolvedProjectPath);
		getProjectFiles(context);

		if (context.dappInfo.hasSmartContract && context.contractInfo) {
			buildSmartContract(context.contractInfo);
		}

		await installDependencies(context);
		logInstructions(context.dappInfo.useBackend);
	} catch (e) {
		selfDestroy(e);
	}
}

run();
