export const generateAlchemyURL = (chain): string => {
	let rpcUrl = "";

	switch (chain) {
		case "ETH_MAINNET":
			rpcUrl =
				"`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`";
			break;
		case "ETH_GOERLI":
			rpcUrl =
				"`https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`";
			break;
		case "MATIC_MAINNET":
			rpcUrl =
				"`https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`";
			break;
		case "MATIC_MUMBAI":
			rpcUrl =
				"`https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`";
			break;
		case "POLYGON_ZKEVM_MAINNET":
			rpcUrl =
				"`https://polygonzkevm-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`";
			break;
		case "POLYGON_ZKEVM_TESTNET":
			rpcUrl =
				"`https://polygonzkevm-testnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`";
			break;
		case "ARB_MAINNET":
			rpcUrl =
				"`https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`";
			break;
		case "ARB_GOERLI":
			rpcUrl =
				"`https://arb-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`";
			break;
		case "OPT_MAINNET":
			rpcUrl =
				"`https://opt-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`";
			break;
		case "OPT_GOERLI":
			rpcUrl =
				"`https://opt-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`";
			break;
		case "SOL_MAINNET":
			rpcUrl =
				"`https://solana-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`";
			break;
		case "SOL_MAINNET":
			rpcUrl =
				"`https://solana-devnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`";
			break;
	}

	return rpcUrl;
};
