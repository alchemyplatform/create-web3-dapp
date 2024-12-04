import context from "../core/context.js";
import { ChainType } from "../core/workflows/templatesWorkflow.js";

export const getTestnet = (): void => {
	if (!context.dappInfo.chain) return;

	// Set chain type
	context.dappInfo.chainType = getChainType(context.dappInfo.chain);

	// Map mainnet to testnet
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
		case "POLYGON_ZKEVM_MAINNET":
			context.dappInfo.testnet = "POLYGON_ZKEVM_TESTNET";
			break;
		case "AVAX_MAINNET":
			context.dappInfo.testnet = "AVAX_FUJI";
			break;
		case "BASE_MAINNET":
			context.dappInfo.testnet = "BASE_GOERLI";
			break;
		case "ZKSYNC_MAINNET":
			context.dappInfo.testnet = "ZKSYNC_TESTNET";
			break;
	}
};

function getChainType(chain: string): ChainType {
	const evmChains = ["ETH_MAINNET", "MATIC_MAINNET", "AVAX_MAINNET"];
	const layer2Chains = [
		"POLYGON_ZKEVM_MAINNET",
		"ARB_MAINNET",
		"OPT_MAINNET",
		"BASE_MAINNET",
		"ZKSYNC_MAINNET",
		"ARB_NOVA"
	];

	if (evmChains.includes(chain)) return ChainType.EVM;
	if (layer2Chains.includes(chain)) return ChainType.LAYER2;
	return ChainType.CUSTOM;
}
