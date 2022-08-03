import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultWallets,
  RainbowKitProvider
} from '@rainbow-me/rainbowkit'
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig
} from 'wagmi'

import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from 'wagmi/providers/public'

export const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
  [
    alchemyProvider({ alchemyId: "demo" }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: "",
  chains
})

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

export {WagmiConfig, RainbowKitProvider}