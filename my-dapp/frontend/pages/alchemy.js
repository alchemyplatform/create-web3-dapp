import { Network, Alchemy } from "alchemy-sdk";

const settings = {
	apiKey: process.env.ALCHEMY_API_KEY,
	network: Network.[process.env.ALCHEMY_NETWORK],
};

const alchemy = new Alchemy(settings);

export default alchemy;
