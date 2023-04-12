import open from "open";
import path from "path";
import prompts from "prompts";
import kill from "../../utils/kill.js";
import { validateProjectName } from "../../utils/validation.js";
import context from "../context.js";
import { generateDapp } from "../generateDapp.js";
import { selfDestroy, setRoot } from "../selfDestroy.js";

export async function startTemplatesWorkflow(useBackend = false, projectName?) {
	context.dappInfo.isTemplate = true;
	context.dappInfo.useBackend = useBackend;
	context.dappInfo.backendProvider = "hardhat-template";

	let step = 0;
	let quit = false;
	while (!quit) {
		let exit = 0;
		switch (step) {
			case 0:
				try {
					context.projectName = projectName;
					while (!context.projectName?.length) {
						if (exit >= 2) {
							kill();
						}
						exit++;
						const projectPath = await prompts({
							type: "text",
							name: "projectPath",
							message: "Please, insert a project name",
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
				await prompts({
					type: "select",
					name: "chain",
					message: "Choose your chain",
					choices: [
						{ title: "Ethereum", value: "ETH_MAINNET" },
						{ title: "Polygon", value: "MATIC_MAINNET" },
						{ title: "Polygon zkEVM", value: "POLYGON_ZKEVM_MAINNET" },
						{ title: "Arbitrum", value: "ARB_MAINNET" },
						{ title: "Optimism", value: "OPT_MAINNET" },
						{ title: "Back", value: "back" },
					],
					initial: 0,
					hint: "- We’ll install all the right dependencies for you :)",
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
				step++;
				break;

				

			case 2:
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

			case 3:
				try {
					const alchemyAPIKey: string = await prompts({
						type: "text",
						name: "apiKey",
						message:
							"Insert your Alchemy API Key (Copy from https://auth.alchemy.com/?a=create-web3-dapp):",
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
	generateDapp();
}
