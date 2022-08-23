import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Panel } from "./components/panels";
import { Section } from "./layout/section";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
require("@solana/wallet-adapter-react-ui/styles.css");


export default function Home() {
	

	return (
		<div>
			<header className={styles.header_container}>
				<div className={styles.navbar}>
					<WalletMultiButton/>
				</div>
				<div className={styles.logo_container}>
					<h1 className={styles.logo}>🔮</h1>
					<h1>create-web3-dapp</h1>
					<p>Get started by editing pages/index.js</p>
				</div>
			</header>
			<main className={styles.main}>
				<Section>
					<Panel></Panel>
				</Section>
			</main>
		</div>
		

	);
}
