export const generateAlchemyURL = (chain, apiKey): string => {
	let rpcUrl = "";

	switch (chain) {
		case "ethereum":
			rpcUrl =
				"`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`";
			break;
		case "goerli":
			rpcUrl =
				"`https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`";
			break;
		case "polygon":
			rpcUrl =
				"`https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`";
			break;
		case "mumbai":
			rpcUrl =
				"`https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`";
			break;
		case "arbitrum":
			rpcUrl =
				"`https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`";
			break;
		case "arbitrum-goerli":
			rpcUrl =
				"`https://arb-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`";
			break;
		case "optimism":
			rpcUrl =
				"`https://opt-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`";
			break;
		case "optimism-goerli":
			rpcUrl =
				"`https://opt-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`";
			break;
		case "solana":
			rpcUrl =
				"`https://solana-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`";
			break;
		case "solana-devnet":
			rpcUrl =
				"`https://solana-devnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`";
			break;
	}

	return rpcUrl;
};
