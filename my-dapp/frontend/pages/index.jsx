import styles from "../styles/Home.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Panel } from "./components/panels";
import { Section } from "./layout/section";

export default function Home() {
	/* WARNING:: the API key will be exposed on the browser - ideally you should get your key through server side rendering
or get the data directly from your APIs */

	

	return (
		<div>
			<header className={styles.header_container}>
				<div className={styles.navbar}>
					<ConnectButton></ConnectButton>
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
