#!/usr/bin/env node
import prompts from "prompts";
import path from "path";
import { installDependencies } from "./helpers/core/dependenciesInstaller.js";
import { existsSync } from "fs";
import { mkdir } from "./helpers/utils/mkdir.js";
import { getProjectFiles } from "./helpers/core/getProjectFiles.js";
import { selfDestroy, setRoot } from "./helpers/core/selfDestroy.js";
import chalk from "chalk";
import { dappInfo } from "./interfaces/dappInfo.js";
import { logInstructions } from "./helpers/core/logInstructions.js";
import { smartContractWizard } from "./helpers/smartContractsWizard/smartContractWizard.js";
import { buildSmartContract } from "./helpers/smartContractsWizard/smartContractBuilder.js";
import {
	getModulesInCathegory,
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
	let contractInfo;
	const dappInfo: dappInfo = {
		chain: "",
		isEVM: true,
		isTestnet: false,
		useBackend: false,
		backendProvider: "",
		toolkitType: undefined,
		modules: null,
		alchemyAPIKey: "demo",
	};

	let projectName = "";
	let resolvedProjectPath = "";

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

					resolvedProjectPath = path.resolve(projectPath);
					let dirExists: boolean = existsSync(resolvedProjectPath);

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
					setRoot(resolvedProjectPath);
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
						dappInfo.chain = "ethereum";
						dappInfo.isEVM = true;
						dappInfo.isTestnet = true;

						step = 5;
					} else if (builderTemplate == "sol_app") {
						dappInfo.chain = "solana";
						dappInfo.isEVM = false;
						dappInfo.isTestnet = false;

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
						{ title: "Ethereum", value: "ethereum" },
						{ title: "Polygon", value: "polygon" },
						{ title: "Artbitrum", value: "arbitrum" },
						{ title: "Optimism", value: "optimism" },
						{ title: "Solana", value: "solana" },
						{ title: "Back", value: "back" },
					],
					initial: 0,
					hint: "- This will make sure to copy the right dependencies and template files",
				}).then((data) => (dappInfo.chain = data.chain));
				if (dappInfo.chain == "back") {
					step--;
					break;
				}

				dappInfo.isEVM =
					dappInfo.chain == "ethereum" ||
					dappInfo.chain == "polygon" ||
					dappInfo.chain == "arbitrum" ||
					dappInfo.chain == "optimism"
						? true
						: false;
				step++;
				break;

			case 3:
				try {
					if (
						dappInfo.chain === "ethereum" ||
						dappInfo.chain === "polygon"
					) {
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
					}
					step++;
				} catch (e) {
					selfDestroy(e);
				}

				break;
			case 4:
				try {
					if (dappInfo.chain !== "solana") {
						await prompts({
							type: "select",
							name: "toolkitType",
							message: "What kind of DApp are you building?",
							choices: [
								{ title: "NFTs", value: "nfts" },
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
								{ title: "Blank", value: undefined },
								{ title: "Back", value: "back" },
							],
							initial: 0,
							hint: "- Select Blank to start from scratch",
						}).then(
							(data) => (dappInfo.toolkitType = data.toolkitType)
						);

						if (
							dappInfo.toolkitType &&
							typeof dappInfo.toolkitType === "string"
						) {
							if (dappInfo.toolkitType == "back") {
								step--;
								break;
							}

							const modules = getModulesInCathegory(
								dappInfo.toolkitType
							);

							await prompts({
								type: "multiselect",
								name: "modules",
								message: "Import template react components",
								choices: [...modules],
								hint: "- Space to select. Return to submit",
							}).then(
								(data) => (dappInfo.modules = data.modules)
							);
							const continueComponentSelection = await prompts({
								type: "toggle",
								name: "continueComponentSelection",
								message: "Confirm components selection?",
								initial: true,
								active: "yes",
								inactive: "no",
							}).then((data) => data.continueComponentSelection);
							if (!continueComponentSelection) {
								if (dappInfo.toolkitType && dappInfo.modules) {
									selectModulesInCathegory(
										dappInfo.toolkitType,
										dappInfo.modules
									);
								}
								break;
							}
						}
					}
					if (dappInfo.toolkitType && dappInfo.modules) {
						selectModulesInCathegory(
							dappInfo.toolkitType,
							dappInfo.modules
						);
					}

					step++;
				} catch (e) {
					selfDestroy(e);
				}

				break;
			case 5:
				try {
					let useBackend;
					if (dappInfo.chain == "solana") {
						useBackend = await prompts({
							type: "select",
							name: "useBackend",
							message: "Do you want to import Anchor?",
							choices: [
								{
									title: "Yes",
									description:
										"This option has a description",
									value: true,
								},
								{ title: "No", value: false },
								{ title: "Back", value: "back" },
							],
							initial: 0,
							hint: "- This will install the needed dependencies to your project",
						}).then((data) => data.useBackend);
						if (typeof useBackend == "string") {
							step--;
							break;
						} else {
							dappInfo.backendProvider = "anchor";
						}
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
										"This option has a description",
									value: true,
								},
								{ title: "No", value: false },
								{ title: "Back", value: "back" },
							],
							initial: 0,
							hint: "- This will install the needed dependencies to your project",
						}).then((data) => data.useBackend);
						if (typeof useBackend == "string") {
							step--;
							break;
						}
						dappInfo.useBackend = useBackend;

						if (dappInfo.useBackend) {
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
							dappInfo.backendProvider = backendProvider;

							const wantsContract: boolean = await prompts({
								type: "select",
								name: "wantsContract",
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
								hint: "- This will install the needed dependencies to your project",
							}).then((data) => data.wantsContract);
							if (wantsContract) {
								contractInfo = await smartContractWizard();
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
							"Insert your Alchemy API Key (if none, 'demo' will be used)",
						initial: "demo",
					}).then((data) => data.apiKey);

					dappInfo.alchemyAPIKey = alchemyAPIKey;

					quit = true;
				} catch (e) {
					selfDestroy(e);
				}

				break;
		}
	}

	try {
		mkdir(resolvedProjectPath);
		getProjectFiles(resolvedProjectPath, dappInfo);

		if (contractInfo) {
			buildSmartContract(contractInfo);
		}

		await installDependencies(projectName, resolvedProjectPath, dappInfo);
		logInstructions();
	} catch (e) {
		selfDestroy(e);
	}
}

run();
