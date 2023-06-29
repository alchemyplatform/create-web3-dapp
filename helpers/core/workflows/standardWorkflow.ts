import open from "open";
import path from "path";
import prompts from "prompts";
import context from "../../core/context.js";
import { LogLevel, selfDestroy, setRoot } from "../../core/selfDestroy.js";
import { smartContractWizard } from "../../smartContractsWizard/smartContractWizard.js";
import { generateDapp } from "../generateDapp.js";
import { validateProjectName } from "../../utils/validation.js";
import { getTestnet } from "../../utils/getTestnet.js";
import {
	getTemplateSpecs,
	supportsTypescript,
} from "../../templates_records/templatesDB.js";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export async function startStandardWorkflow() {
	let step = 0;
	let quit = false;
	let projectPath = "";

	while (!quit) {
		let exit = 0;
		switch (step) {
			case 0:
				if (context.projectName && context.resolvedProjectPath) {
					step++;

					break;
				}
				try {
					projectPath = "";
					if (typeof projectPath === "string") {
						projectPath = projectPath.trim();
					}
					context.projectName = "";
					while (!context.projectName?.length) {
						if (exit >= 2) {
							selfDestroy();
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
					selfDestroy(e, LogLevel.ERROR);
				}
				step++;
				break;
			case 1:
				try {
					if (
						!context.dappInfo.isTemplate &&
						!context.dappInfo.template
					) {
						const template: Number | String = await prompts({
							type: "select",
							name: "template",
							message: "Choose how to start",
							choices: [
								{
									title: "Boilerplates dapp",
									value: "new",
									message:
										"Start building your application from scratch",
								},
								{
									title: "NFT Explorer",
									value: "nft-explorer",
									message:
										"A template to build NFTs explorers",
								},
								{
									title: "Back",
									value: "back",
								},
							],
							initial: 0,
							hint: "- Create a default app ",
						}).then((data) => data.template);
						if (template == "new") {
							context.dappInfo.isTemplate = false;
							context.dappInfo.template = "new";
						} else if (template == "back") {
							context.projectName = null;
							context.resolvedProjectPath = null;
							step--;
							break;
						} else {
				
							await getTemplateSpecs(template as string);
						}
					}
					if (!context.dappInfo.isTypescript) {
						if (
							supportsTypescript(
								context.dappInfo.template as string
							) ||
							context.dappInfo.template == "new"
						) {
							if (!context.dappInfo.isTypescript) {
								const isTypescript: Number | String =
									await prompts({
										type: "toggle",
										name: "isTypescript",
										message:
											"Do you want to use Typescript?",
										initial: true,
										active: "Typescript",
										inactive: "Javascript",
									}).then(
										(data) =>
											(context.dappInfo.isTypescript =
												data.isTypescript)
									);
							}
						}
					}

					step++;
				} catch (e) {
					selfDestroy(e, LogLevel.ERROR);
				}
				break;
			case 2:
				if (context.dappInfo.chain) {
					step++;
					break;
				}
				await prompts({
					type: "select",
					name: "chain",
					message: "Choose your chain",
					choices: [
						{ title: "Ethereum", value: "ETH_MAINNET" },
						{ title: "Polygon", value: "MATIC_MAINNET" },
						{
							title: "Polygon zkEVM",
							value: "POLYGON_ZKEVM_MAINNET",
						},
						{ title: "Arbitrum", value: "ARB_MAINNET" },
						{ title: "Optimism", value: "OPT_MAINNET" },
						{ title: "Back", value: "back" },
					],
					initial: 0,
					hint: "- You can change this later",
				}).then((data) => (context.dappInfo.chain = data.chain));
				if (context.dappInfo.chain == "back") {
					context.dappInfo.chain = "";
					context.dappInfo.isTypescript = false;
					context.dappInfo.isTemplate = false;
					context.dappInfo.template = "";
					step -= 2;
					break;
				}
				if (!context.dappInfo.chain?.length) {
					process.exit();
				}
				getTestnet();
				step++;
				break;

			case 3:
				if (
					context.dappInfo.useBackend &&
					context.dappInfo.backendProvider
				) {
					step++;
					break;
				}
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
						context.dappInfo.chain = "";
						break;
					} else if (backendProvider == "skip") {
						context.dappInfo.useBackend = false;
						context.dappInfo.backendProvider = undefined;
						step = 5;
						break;
					} else if (typeof backendProvider == "string") {
						context.dappInfo.useBackend = true;
						context.dappInfo.backendProvider = backendProvider;
						step++;
					} else {
						selfDestroy();
					}
				} catch (e) {
					selfDestroy(e, LogLevel.ERROR);
				}
				break;

			case 4:
				if (context.dappInfo.useBackend) {
					if (
						context.dappInfo.hasSmartContract &&
						context.contractInfo?.name &&
						context.contractInfo?.symbol
					) {
						step++;
						break;
					}
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
						context.dappInfo.useBackend = false;
						context.dappInfo.backendProvider = "";
						break;
					} else if (typeof hasContract == "boolean") {
						context.dappInfo.hasSmartContract = hasContract;
						if (hasContract) {
							context.contractInfo = await smartContractWizard();
							if (!context.contractInfo?.name) {
								break;
							}
						} else {
							step++;
						}
					} else {
						process.exit();
					}
				}
				step++;

				break;
			case 5:
				if (context.dappInfo.apiKeys.ALCHEMY_API_KEY) {
					step = 7;
					break;
				}

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
					selfDestroy(e, LogLevel.ERROR);
				}
				break;

			case 6:
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
					step++;
					break;
				} catch (e) {
					selfDestroy(e, LogLevel.ERROR);
				}
			case 7:
				{
					const helpUs: Number | String = await prompts({
						type: "toggle",
						name: "storeAnonymisedData",
						message:
							"Help us improve create-web3-dapp with anonymous crash & basic usage data?",
						initial: true,
						active: "yes",
						inactive: "no",
					}).then(
						(data) =>
							(context.dappInfo.storeAnonymisedData =
								data.storeAnonymisedData)
					);
				}
				quit = true;
				break;
		}
	}
	if (context.dappInfo.storeAnonymisedData) await saveSessionData();
	if (context.resolvedProjectPath && context.projectName) generateDapp();
}

const saveSessionData = async () => {
	const url =
		"https://p85vbvjhtk.execute-api.eu-central-1.amazonaws.com/Stage/save-session-data";
	const duDappInfoContext = { ...context.dappInfo };
	delete (duDappInfoContext as any)?.apiKeys;

	const data = {
		sessionId: uuidv4(),
		dappInfo: duDappInfoContext,
	};

	try {
		const response = await axios.post(url, data);
	} catch (error) {
		console.error("Error:", error);
	}
};
