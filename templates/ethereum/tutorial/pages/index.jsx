import Image from "next/image";
import styles from "../styles/Home.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Network, Alchemy } from "alchemy-sdk";
import { useAccount } from "wagmi";
import { NFTGallery } from "./components/nftGallery";
import { TransactionsBox } from "./components/transactionsBox";
import { Panel } from "./components/panels";
import { Section } from "./layout/section";

export default function Home() {
	const { address, isConnected } = useAccount();
	/* WARNING:: the API key will be exposed on the browser - ideally you should get your key through server side rendering
or get the data directly from your APIs */

	const settings = {
		apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
		network: Network.ETH_MAINNET,
	};

	const alchemy = new Alchemy(settings);

	return (
		<div>
			<header className={styles.header_container}>
				<div className={styles.navbar}>
					<ConnectButton></ConnectButton>
				</div>
				<div className={styles.logo_container}>
					<Image
						src={"/logo.svg"}
						width="150"
						height="150"
						alt="Alchemy logo"
					></Image>
					<h1>Welcome to Web3</h1>
					<p>Get started by editing pages/index.js</p>
				</div>
			</header>
			<main className={styles.main}>
				<Section>
					<Panel></Panel>
				</Section>

				<h2>Alchemy SDK ready</h2>
				<p>Access all the blockchain data in a few lines of code</p>

				<Section title={"Get NFTs by Owner"}>
					<NFTGallery
						alchemy={alchemy}
						address={address}
					></NFTGallery>
				</Section>

				<Section title={"Listen to network transactions"}>
					<p>
						{`alchemy.ws.once(
                {
                  method: 'alchemy_pendingTransactions',
                  toAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
                },
                res => console.log(res)
              );`}
					</p>
					<TransactionsBox alchemy={alchemy} />
				</Section>
			</main>
		</div>
	);
}
