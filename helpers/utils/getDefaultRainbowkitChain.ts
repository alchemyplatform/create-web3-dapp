export const getDefaultRainbowkitChain = function (chain: string): string {
	const chainToRainbowkitChain: Record<string, string> = {
		ETH_MAINNET: "mainnet",
		MATIC_MAINNET: "polygon",
		ARB_MAINNET: "arbitrum",
		OPT_MAINNET: "optimism",
		ETH_GOERLI: "goerli",
		MATIC_MUMBAI: "polygonMumbai",
		POLYGON_ZKEVM_MAINNET: "polygonZkEvm",
		
		POLYGON_ZKEVM_TESTNET: "polygonZkEvmTestnet",
		ARB_GOERLI: "arbitrumGoerli",
		OPT_GOERLI: "optimismGoerli",
		AVAX_MAINNET: "avalanche",
		AVAX_FUJI: "avalancheFuji",
		BASE_MAINNET: "base",
		BASE_GOERLI: "baseGoerli",
		ZKSYNC_MAINNET: "zkSync",
		ZKSYNC_TESTNET: "zkSyncTestnet"
	};

	return chainToRainbowkitChain[chain] || chain.toLowerCase();
};
