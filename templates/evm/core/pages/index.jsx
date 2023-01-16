import styles from "../styles/Home.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import  Panel  from "../components/panels";
import { Section } from "../layout/section";

export default function Home() {
	return (
		<div>
			<header className={styles.header_container}>
				<nav className={styles.navbar}>
					<a
						href="https://alchemy.com/?a=create-web3-dapp"
						target={"_blank"}
					>
						<img
							className={styles.alchemy_logo}
							src="/alchemy_logo.svg"
						></img>
					</a>
					<ConnectButton></ConnectButton>
				</nav>
				<div className={styles.logo_container}>
					<h1 className={styles.logo}>🔮</h1>
					<h1>create-web3-dapp</h1>
					<a target={"_blank"} href="https://github.com/alchemyplatform/create-web3-dapp" className={styles.docs_box}>
						Visit the documentation to get started
					</a>
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
