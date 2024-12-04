import type { PromptObject } from "prompts";
import prompts from "prompts";
import open from "open";
import { join } from "path";
import kill from "../../utils/kill.js";
import { validateProjectName } from "../../utils/validation.js";
import context from "../context.js";
import { generateDapp } from "../generateDapp.js";
import { selfDestroy, setRoot } from "../selfDestroy.js";

export enum ChainType {
	EVM = "evm",
	LAYER2 = "layer2",
	CUSTOM = "custom"
}

interface Chain {
	title: string;
	value: string;
	type: ChainType;
	testnet?: string;
	rpcUrl?: string;
}

interface PromptResponses {
	projectPath?: string;
	chain?: string;
	backend?: "foundry" | "hardhat" | "back";
	hasAccount?: boolean;
	apiKey?: string;
}

type ChainResponse = {
	chain: string;
}

type BackendResponse = {
	backend: "foundry" | "hardhat" | "back";
}

type AccountResponse = {
	hasAccount: boolean;
}

type ApiKeyResponse = {
	apiKey: string;
}

const SUPPORTED_CHAINS: Chain[] = [
	{ title: "Ethereum", value: "ETH_MAINNET", type: ChainType.EVM, testnet: "ETH_GOERLI" },
	{ title: "Polygon", value: "MATIC_MAINNET", type: ChainType.EVM, testnet: "MATIC_MUMBAI" },
	{ title: "Polygon zkEVM", value: "POLYGON_ZKEVM_MAINNET", type: ChainType.LAYER2, testnet: "POLYGON_ZKEVM_TESTNET" },
	{ title: "Arbitrum", value: "ARB_MAINNET", type: ChainType.LAYER2, testnet: "ARB_GOERLI" },
	{ title: "Optimism", value: "OPT_MAINNET", type: ChainType.LAYER2, testnet: "OPT_GOERLI" },
	{ title: "Base", value: "BASE_MAINNET", type: ChainType.LAYER2, testnet: "BASE_GOERLI" },
	{ title: "zkSync Era", value: "ZKSYNC_MAINNET", type: ChainType.LAYER2, testnet: "ZKSYNC_TESTNET" },
	{ title: "Arbitrum Nova", value: "ARB_NOVA", type: ChainType.LAYER2 },
	{ 
		title: "Avalanche C-Chain", 
		value: "AVAX_MAINNET", 
		type: ChainType.EVM, 
		testnet: "AVAX_FUJI",
		rpcUrl: "https://api.avax.network/ext/bc/C/rpc"
	}
] as const;

export async function startTemplatesWorkflow(useBackend = false, projectName?: string): Promise<void> {
	try {
		context.dappInfo.isTemplate = true;
		context.dappInfo.useBackend = useBackend;
		context.dappInfo.backendProvider = "foundry"; // Default to Foundry

		let step = 0;
		let quit = false;
		
		while (!quit) {
			let exit = 0;
			switch (step) {
				case 0: {
					try {
						context.projectName = projectName ?? null;
						while (!context.projectName?.length) {
							if (exit >= 2) {
								kill();
								return;
							}
							exit++;
							const response = await prompts({
								type: "text",
								name: "projectPath",
								message: "Please, insert a project name",
								initial: "my-create-web3-dapp",
								validate: (value: string) => validateProjectName(value),
							});

							const projectPath = response.projectPath?.trim();
							if (projectPath) {
								context.resolvedProjectPath = join(process.cwd(), projectPath);
								context.projectName = projectPath;
								setRoot(context.resolvedProjectPath);
							}
						}
					} catch (e) {
						selfDestroy(e);
					}
					step++;
					break;
				}

				case 1: {
					try {
						const chainResponse = await prompts<ChainResponse>({
							type: "select",
							name: "chain",
							message: "Choose your chain",
							choices: [
								...SUPPORTED_CHAINS.map(chain => ({ title: chain.title, value: chain.value })),
								{ title: "Back", value: "back" }
							],
							initial: 0,
							hint: "- We'll install all the right dependencies for you :)",
						});

						if (!chainResponse.chain) {
							process.exit(1);
						}

						if (chainResponse.chain === "back") {
							step--;
							break;
						}

						context.dappInfo.chain = chainResponse.chain;
						const selectedChain = SUPPORTED_CHAINS.find(chain => chain.value === chainResponse.chain);
						if (selectedChain) {
							context.dappInfo.chainType = selectedChain.type;
							context.dappInfo.testnet = selectedChain.testnet;
						}

						step++;
					} catch (e) {
						selfDestroy(e);
					}
					break;
				}

				case 2: {
					try {
						if (context.dappInfo.useBackend) {
							const backendResponse = await prompts<BackendResponse>({
								type: "select",
								name: "backend",
								message: "Choose your smart contract development environment",
								choices: [
									{ title: "Foundry (Recommended)", value: "foundry" },
									{ title: "Hardhat", value: "hardhat" },
									{ title: "Back", value: "back" }
								],
								initial: 0,
							});

							if (backendResponse.backend === "back") {
								step--;
								break;
							}

							context.dappInfo.backendProvider = backendResponse.backend;
						}
						step++;
					} catch (e) {
						selfDestroy(e);
					}
					break;
				}

				case 3: {
					try {
						const accountResponse = await prompts<AccountResponse>({
							type: "toggle",
							name: "hasAccount",
							message: "Do you already have an Alchemy account?",
							initial: true,
							active: "yes",
							inactive: "no",
						});

						if (typeof accountResponse.hasAccount === "boolean") {
							if (!accountResponse.hasAccount) {
								await open("https://auth.alchemy.com/?a=create-web3-dapp");
							}
							step++;
							break;
						} else {
							process.exit(1);
						}
					} catch (e) {
						selfDestroy(e);
					}
					break;
				}

				case 4: {
					try {
						const apiKeyResponse = await prompts<ApiKeyResponse>({
							type: "text",
							name: "apiKey",
							message: "Insert your Alchemy API Key (Copy from https://auth.alchemy.com/?a=create-web3-dapp):",
							initial: "",
						});

						const alchemyAPIKey = apiKeyResponse?.apiKey;
						if (!alchemyAPIKey || alchemyAPIKey.length < 32 || alchemyAPIKey.length > 33) {
							break;
						}

						context.dappInfo.apiKeys.ALCHEMY_API_KEY = alchemyAPIKey;
						quit = true;
					} catch (e) {
						selfDestroy(e);
					}
					break;
				}
			}
		}
		await generateDapp();
	} catch (error) {
		selfDestroy(error);
	}
}
