import kill from "../../utils/kill.js";
import { checkNewPackageUpdates } from "../../utils/checkNewPackageUpdates.js";
import context from "../../core/context.js";
import path from "path";
import prompts from "prompts";
import { existsSync } from "fs";
import { selfDestroy, setRoot } from "../../core/selfDestroy.js";
import { smartContractWizard } from "../../smartContractsWizard/smartContractWizard.js";
import {generateDapp} from "../generateDapp.js"
export async function startStandardWorkflow() {
	await checkNewPackageUpdates();
	let step = 0;
	let quit = false;
	let projectPath = "";
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
							initial: `my-create-web3-dapp-${i}`,
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
					context.dappInfo.isTemplate = false;

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
								value: "template",
								message:
									"Compatible with: Ethereum, Polygon, etc.",
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
					} else if (builderTemplate == "template") {
						context.dappInfo.isTemplate = true;
						const template: string = await prompts({
							type: "select",
							name: "template",
							message: "Select a template",
							choices: [
								{
									title: "NFT Gallery",
									value: 0,
									message:
										"Compatible with: Ethereum, Polygon, etc.",
								},
							],
							initial: 0,
							hint: "- Create a default app ",
						}).then(
							(data) =>
								(context.dappInfo.template = data.template)
						);
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
						{ title: "Arbitrum", value: "ARB_MAINNET" },
						{ title: "Optimism", value: "OPT_MAINNET" },
						{ title: "Back", value: "back" },
					],
					initial: 0,
					hint: "- We’ll make sure all the right dependencies are installed for you :)",
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
						message:
							"Do you want to configure with the mainnet or testnet?",
						choices: [
							{
								title: "Mainnet",
								value: false,
							},
							{ title: "Testnet", value: true },
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

					const backendProvider = await prompts({
						type: "select",
						name: "backendProvider",
						message:
							"Select your blockchain development environment or skip:",
						hint: "- This will allow you to create, build, deploy and test smart contracts",
						choices: [
							{ title: "Hardhat", value: "hardhat" },
							{
								title: "Foundry (coming soon)",
								value: "foundry",
								disabled: true,
							},
							{
								title: "Skip",
								value: "skip",
							},
							{ title: "Back", value: "back" },
						],
						initial: 0,
					}).then((data) => data.backendProvider);
					if (backendProvider == "back") {
						step--;
						break;
					} else if (backendProvider == "skip") {
						context.dappInfo.useBackend = false;
						context.dappInfo.backendProvider = undefined;
						step = 6;
						break;
					} else if (typeof backendProvider == "string") {
						context.dappInfo.useBackend = true;
						context.dappInfo.backendProvider = backendProvider;
						step++;
					} else {
						kill();
					}
				} catch (e) {
					selfDestroy(e);
				}
			case 5:
				if (context.dappInfo.useBackend) {
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
							context.contractInfo = await smartContractWizard();
						}
					} else {
						process.exit();
					}
				}
				step++;
				break;
			case 6:
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

			case 7:
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
	generateDapp(projectPath)
}
