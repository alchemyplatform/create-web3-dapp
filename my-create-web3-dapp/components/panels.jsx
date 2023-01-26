import styles from "../styles/Panels.module.css";

export default function Panels() {
	return (
		<div className={styles.panels_container}>
			<div className={styles.panel_container}>
				<h2>Update your enviornment variables</h2>
				<p>
					You might see rate limits going around, that's because you're using an Alchemy demo key. 
					Get your API key and add it in a new .env.local file.
				</p>
				<div className={styles.button_container}>
					<a target={"_blank"} href="https://docs.alchemy.com/" className={styles.button}>Show me how</a>
				</div>
			</div>
			<div className={styles.panel_container}>
				<h2>Protoype your dapp in minutes</h2>
				<p className={styles.text_box}>
					Production ready and web3 enabled components to prototype your dapps in seconds. Run this in your create-web3-dapp front end directory:
				</p>
				<div className={styles.code_container}>
					<p
						onClick={() => {
							navigator.clipboard.writeText("npm run marketplace").then(() => {
								alert("Copied to clipboard");
							});
						}}
					>
						$ npm run marketplace
					</p>
				</div>
			</div>
			<div className={styles.panel_container}>
				<h2>Explore the Alchemy ecosystem</h2>
				<p>
					Get access to the most reliable blockchain infrastructure. Tens of web3 APIs to build your next decentralized breakthrough.
				</p>
				<div className={styles.button_container}>
					<a target={"_blank"} href="https://alchemy.com" className={styles.button}>Bring me there</a>
				</div>
			</div>
			<div className={styles.au_box_container}>
				<div className={styles.au_box}>
					<div className={styles.au_text_container}>
						<h2>Earn your free web3 degree</h2>
						<p>
							Earn your web3 degree and kickstart your web3 development career completely for free.
						</p>
					</div>
					<div className={styles.au_button_container}>
						<a className={styles.button} target={"_blank"} href="https://university.alchemy.com">I want to learn</a>
					</div>
				</div>
			</div>
		</div>
	);
}
