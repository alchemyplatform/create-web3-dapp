import context from "../core/context.js";

export const getTestnet = () => {
	context.dappInfo.isEVM = true;

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
		default:
			return;
	}
};
