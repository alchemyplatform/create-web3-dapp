import "@rainbow-me/rainbowkit/styles.css";
import process from "process";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";

import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

export const { chains, provider } = configureChains(
	[
		chain.mainnet,
		chain.goerli,
		chain.polygonMumbai,
		chain.polygon,
		chain.optimism,
		chain.arbitrum,
	],
	[
		alchemyProvider({ alchemyId: process.env.ALCHEMY_API_KEY }),
		publicProvider(),
	]
);

const { connectors } = getDefaultWallets({
	appName: "create-web3-dapp",
	chains,
});

export const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider,
});

export { WagmiConfig, RainbowKitProvider };
