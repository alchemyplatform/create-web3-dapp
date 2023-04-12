export const getDefaultRainbowkitChain = function (chain: string): string {
	const chainToRainbowkitChain = {
		ETH_MAINNET: "mainnet",
		MATIC_MAINNET: "polygon",
		ARB_MAINNET: "optimism",
		OPT_MAINNET: "arbitrum",
		ETH_GOERLI: "goerli",
		MATIC_MUMBAI: "polygonMumbai",
		POLYGON_ZKEVM_MAINNET: "polygonZkEvm",
		POLYGON_ZKEVM_TESTNET: "polygonZkEvmTestnet",
		ARB_GOERLI: "arbitrumGoerli",
		OPT_GOERLI: "optimismGoerli",
	};

	return chainToRainbowkitChain[chain];
};
