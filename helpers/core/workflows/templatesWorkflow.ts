import kill from "../../utils/kill.js";
import { checkNewPackageUpdates } from "../../utils/checkNewPackageUpdates.js";
import context from "../context.js";
import path from "path";
import prompts from "prompts";
import { existsSync } from "fs";
import { selfDestroy, setRoot } from "../selfDestroy.js";
import { smartContractWizard } from "../../smartContractsWizard/smartContractWizard.js";
import { generateDapp } from "../generateDapp.js";

export async function startTemplatesWorkflow(template: number) {
	await checkNewPackageUpdates();
	context.dappInfo.isTemplate = true;
	context.dappInfo.template = template;
	context.dappInfo.chain = "ETH_MAINNET";
	context.dappInfo.isEVM = true;

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
			// case 1:
			// 	try {
			// 		const backendProvider = await prompts({
			// 			type: "select",
			// 			name: "backendProvider",
			// 			message:
			// 				"Select your blockchain development environment or skip:",
			// 			hint: "- This will allow you to create, build, deploy and test smart contracts",
			// 			choices: [
			// 				{ title: "Hardhat", value: "hardhat" },
			// 				{
			// 					title: "Foundry (coming soon)",
			// 					value: "foundry",
			// 					disabled: true,
			// 				},
			// 				{
			// 					title: "Skip",
			// 					value: "skip",
			// 				},
			// 				{ title: "Back", value: "back" },
			// 			],
			// 			initial: 0,
			// 		}).then((data) => data.backendProvider);
			// 		if (backendProvider == "back") {
			// 			step--;
			// 			break;
			// 		} else if (backendProvider == "skip") {
			// 			context.dappInfo.useBackend = false;
			// 			context.dappInfo.backendProvider = undefined;
			// 			step = 6;
			// 			break;
			// 		} else if (typeof backendProvider == "string") {
			// 			context.dappInfo.useBackend = true;
			// 			context.dappInfo.backendProvider = backendProvider;
			// 			step++;
			// 		} else {
			// 			kill();
			// 		}
			// 	} catch (e) {
			// 		selfDestroy(e);
			// 	}
			// case 2:
			// 	if (context.dappInfo.useBackend) {
			// 		const hasContract: boolean = await prompts({
			// 			type: "select",
			// 			name: "hasContract",
			// 			message: "Do you want to create a new contract?",
			// 			choices: [
			// 				{
			// 					title: "Yes",
			// 					description:
			// 						"This will start the smart contract creation wizard",
			// 					value: true,
			// 				},
			// 				{ title: "No", value: false },
			// 				{ title: "Back", value: "back" },
			// 			],
			// 			initial: 0,
			// 			hint: "- Create smart contracts directly from the CLI.",
			// 		}).then((data) => data.hasContract);

			// 		if (typeof hasContract == "string") {
			// 			step--;
			// 			break;
			// 		} else if (typeof hasContract == "boolean") {
			// 			context.dappInfo.hasSmartContract = hasContract;
			// 			if (hasContract) {
			// 				context.contractInfo = await smartContractWizard();
			// 			}
			// 		} else {
			// 			process.exit();
			// 		}
			// 	}
			// 	step++;
			// 	break;
			case 1:
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

			case 2:
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
	generateDapp(projectPath);
}
