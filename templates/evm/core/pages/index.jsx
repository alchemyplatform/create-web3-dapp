import styles from "../styles/Home.module.css";
import Panels from "../components/panels";

export default function Home() {
	return (
		<div>
			<header className={styles.header_container}>
				<div className={styles.logo_container}>
					<h1 className={styles.logo}>🔮</h1>
					<h1>create-web3-dapp</h1>
					<a
						target={"_blank"}
						href="https://github.com/alchemyplatform/create-web3-dapp"
						className={styles.docs_box}
					>
						Everything you need to prototype your dapp
					</a>
				</div>
			</header>
			<main className={styles.main}>
				<Panels></Panels>
				<NFTMintingPage></NFTMintingPage>
			</main>
		</div>
	);
}
