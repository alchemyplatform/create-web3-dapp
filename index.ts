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
import ON_DEATH from "death";
import { checkNewPackageUpdates } from "./helpers/utils/checkNewPackageUpdates.js";
import open from "open";
import { smartContractWizard } from "./helpers/smartContractsWizard/smartContractWizard.js";
import { buildSmartContract } from "./helpers/smartContractsWizard/smartContractBuilder.js";
import kill from "./helpers/utils/kill.js";

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

if (
	process.argv[2] &&
	(process.argv[2].toLowerCase() == "marketplace" ||
		process.argv[2].toLowerCase() == "m")
) {
	try {
		console.log("\n");
		console.log("🔵 Sending you to the components marketplace 🔵");
		console.log("\n");
		open("http://localhost:3000/");
	} catch (e) {
		selfDestroy(e);
	}
} else {
	console.log("\n");
	console.log("🔵 Welcome to the create-web3-dapp wizard 🔵");
	console.log("\n");
	run();
}

let projectPath = "";

// Gets project name
ON_DEATH(function (signal, err) {
	console.log("yo");
});
async function run() {
	let step = 0;
	let quit = false;

	await checkNewPackageUpdates();

	while (!quit) {
		let exit = 0;
		switch (step) {
			case 0:
				try {
					projectPath = "";
					// Checks if project name is provided
					if (typeof projectPath === "string") {
						projectPath = projectPath.trim();
					}
					while (!projectPath) {
						if (exit >= 2) {
							kill();
						}
						exit++;
						projectPath = await prompts({
							type: "text",
							name: "projectPath",
							message: "Please, insert a project name",
							initial: "my-create-web3-dapp",
						}).then((data) => data.projectPath);
					}

					projectPath = projectPath.trim().replace(/[\W_]+/g, "-");
					context.resolvedProjectPath = path.resolve(projectPath);
					let dirExists: boolean = existsSync(
						context.resolvedProjectPath
					);

					let i = 1;
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
								title: "Create a new application",
								value: "new",
								message:
									"Compatible with: Ethereum, Polygon, etc.",
							},

							{
								title: "Start from a template",
								value: "new",
								disabled: true,
								message:
									"Create a dapp starting from a template",
							},
							{
								title: "Back",
								value: "back",
							},
						],
						initial: 0,
						hint: "- Create a default app ",
					}).then((data) => data.builderTemplate);

					if (builderTemplate == "new") {
						step++;
						break;
					} else if (builderTemplate == "back") {
						step--;
						break;
					} else {
						kill();
					}
				} catch (e) {
					selfDestroy(e);
				}
				break;
			case 2:
				await prompts({
					type: "select",
					name: "chain",
					message: "Which chain do you want to use?",
					choices: [
						{ title: "Ethereum", value: "ETH_MAINNET" },
						{ title: "Polygon", value: "MATIC_MAINNET" },
						{ title: "Artbitrum", value: "ARB_MAINNET" },
						{ title: "Optimism", value: "OPT_MAINNET" },
						{ title: "Back", value: "back" },
					],
					initial: 0,
					hint: "- This will make sure to copy the right dependencies and template files",
				}).then((data) => (context.dappInfo.chain = data.chain));
				if (context.dappInfo.chain == "back") {
					step--;
					break;
				}
				if (!context.dappInfo.chain?.length) {
					process.exit();
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
					} else if (typeof isTestnet == "boolean") {
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
							}
						}
					} else {
						kill();
					}

					step++;
				} catch (e) {
					selfDestroy(e);
				}

				break;

			case 4:
				try {
					let useBackend;

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
					if (typeof useBackend == "boolean") {
						context.dappInfo.useBackend = useBackend;
					} else {
						kill();
					}

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
						if (typeof backendProvider != "string") {
							kill();
						}
						if (backendProvider == "back") {
							break;
						} else {
							context.dappInfo.backendProvider = backendProvider;
						}

						const hasContract: boolean = await prompts({
							type: "select",
							name: "hasContract",
							message: "Do you want to create a new contract?",
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
						} else if (typeof hasContract == "boolean") {
							context.dappInfo.hasSmartContract = hasContract;
							if (hasContract) {
								context.contractInfo =
									await smartContractWizard();
							}
						} else {
							process.exit();
						}
					}
					step++;
				} catch (e) {
					selfDestroy(e);
				}

				break;
			case 5:
				try {
					const hasAccount: string = await prompts({
						type: "toggle",
						name: "hasAccount",
						message: "Do you already have an Alchemy account?",
						initial: true,
						active: "yes",
						inactive: "no",
					}).then((data) => data.hasAccount);
					if (typeof hasAccount == "boolean") {
						if (!hasAccount) {
							open(
								"https://auth.alchemy.com/?a=create-web3-dapp "
							);
						}
						step++;
						break;
					} else {
						process.exit();
					}
				} catch (e) {
					selfDestroy(e);
				}

			case 6:
				try {
					const alchemyAPIKey: string = await prompts({
						type: "text",
						name: "apiKey",
						message:
							"Insert your Alchemy API Key (create an account at https://auth.alchemy.com/?a=create-web3-dapp):",
						initial: "",
					}).then((data) => data.apiKey);
					if (
						alchemyAPIKey.length < 32 ||
						alchemyAPIKey.length > 33
					) {
						break;
					}

					context.dappInfo.apiKeys.ALCHEMY_API_KEY =
						alchemyAPIKey.length ? alchemyAPIKey : "demo";

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
		logInstructions(context.dappInfo, projectPath);
	} catch (e) {
		selfDestroy(e);
	}
}
