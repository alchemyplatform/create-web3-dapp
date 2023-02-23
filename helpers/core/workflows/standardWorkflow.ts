import { existsSync } from "fs";
import open from "open";
import path from "path";
import prompts from "prompts";
import context from "../../core/context.js";
import { selfDestroy, setRoot } from "../../core/selfDestroy.js";
import { smartContractWizard } from "../../smartContractsWizard/smartContractWizard.js";
import kill from "../../utils/kill.js";
import { generateDapp } from "../generateDapp.js";
import { validateProjectName } from "../../utils/validation.js";
import { startTemplatesWorkflow } from "./templatesWorkflow.js";

export async function startStandardWorkflow() {
	let step = 0;
	let quit = false;
	let projectPath = "";
	while (!quit) {
		let exit = 0;
		switch (step) {
			case 0:
				try {
					projectPath = "";
					if (typeof projectPath === "string") {
						projectPath = projectPath.trim();
					}
					context.projectName = "";
					while (!context.projectName?.length) {
						if (exit >= 2) {
							kill();
						}
						exit++;
						const projectPath = await prompts({
							type: "text",
							name: "projectPath",
							message: "Project name",
							initial: "my-create-web3-dapp",
							validate: (value: string) =>
								validateProjectName(value),
						}).then((data) => data.projectPath.trim());
						if (projectPath) {
							context.resolvedProjectPath =
								path.resolve(projectPath);
							context.projectName = path.basename(
								context.resolvedProjectPath
							);

							setRoot(context.resolvedProjectPath);
						}
					}
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
								title: "Create default full-stack dapp",
								value: "new",
							},
							{
								title: "Create pre-built template",
								value: "template",
								message: "- select to see options",
							},

							{
								title: "Back",
								value: "back",
							},
						],
						initial: 0,
						hint: "Create a new dapp ",
					}).then((data) => data.builderTemplate);

					if (builderTemplate == "new") {
						step++;
						break;
					} else if (builderTemplate == "template") {
						context.dappInfo.isTemplate = true;
						const template: Number | String = await prompts({
							type: "select",
							name: "template",
							message: "Select a template",
							choices: [
								{
									title: "NFT Explorer",
									value: 0,
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
						}).then(
							(data) =>
								(context.dappInfo.template = data.template)
						);
						if (template == "back") {
							break;
						} else if (template == 0) {
							startTemplatesWorkflow(false, context.projectName);
							return;
						}
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
					message: "Choose your chain",
					choices: [
						{ title: "Ethereum", value: "ETH_MAINNET" },
						{ title: "Polygon", value: "MATIC_MAINNET" },
						{ title: "Arbitrum", value: "ARB_MAINNET" },
						{ title: "Optimism", value: "OPT_MAINNET" },
						{ title: "Back", value: "back" },
					],
					initial: 0,
					hint: "- You can change this later",
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
						message: "Choose your network",
						choices: [
							{
								title: "Mainnet",
								value: false,
							},
							{ title: "Testnet", value: true },
							{ title: "Back", value: "back" },
						],
						initial: 0,
						hint: "- You can change this later",
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
					const backendProvider = await prompts({
						type: "select",
						name: "backendProvider",
						message:
							"[Optional] Choose your blockchain development environment:",
						hint: "- Used to create, build, deploy and test smart contracts",
						choices: [
							{
								title: "Hardhat",
								message: "- Learn more at hardhat.org",
								value: "hardhat",
							},
							{
								title: "Foundry (coming soon)",
								value: "foundry",
								disabled: true,
							},
							{
								title: "Skip",
								value: "skip",
								message:
									"- If you're not creating smart contracts",
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
				break;

			case 5:
				if (context.dappInfo.useBackend) {
					const hasContract: boolean = await prompts({
						type: "select",
						name: "hasContract",
						message: "Do you want to create a smart contract?",
						choices: [
							{
								title: "Yes",
								description:
									"This will start the smart contract creation wizard",
								value: true,
							},
							{
								title: "No",
								value: false,
								message:
									"You can always create custom smart contracts later ",
							},
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
							if (!context.contractInfo?.name) {
								break;
							}
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
						open("https://auth.alchemy.com/?a=create-web3-dapp");
						step++;
						break;
					} else {
						process.exit();
					}
				} catch (e) {
					selfDestroy(e);
				}
				break;

			case 7:
				try {
					const alchemyAPIKey: string = await prompts({
						type: "text",
						name: "apiKey",
						message:
							"Insert your Alchemy API Key (Copy from https://auth.alchemy.com/?a=create-web3-dapp):",
						initial: "",
					}).then((data) => data.apiKey);
					if (
						alchemyAPIKey?.length < 32 ||
						alchemyAPIKey?.length > 33
					) {
						break;
					}
					if (!alchemyAPIKey) {
						process.exit();
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
	generateDapp();
}
