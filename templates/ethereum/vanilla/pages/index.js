import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Panel } from "./components/panels";
import { Section } from "./layout/section";

export default function Home() {
	return (
		<div>
			<header className={styles.header_container}>
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
			</main>
		</div>
	);
}
