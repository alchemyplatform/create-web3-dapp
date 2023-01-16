import styles from "../styles/Panels.module.css";

export default function Panels() {
	return (
		<div className={styles.panels_container}>
			<div className={styles.panel_container}>
				<h2>Modify you next.config.js file</h2>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit.
					Vel similique sed sapiente culpa atque modi distinctio vitae
					omnis, ex fugiat.
				</p>
				<div className={styles.button_container}>
					<button className={styles.button}>Let's go</button>
				</div>
			</div>
			<div className={styles.panel_container}>
				<h2>Protoype your dapp in minutes</h2>
				<p className={styles.text_box}>
					Explore production ready components
				</p>
				<div className={styles.button_container}>
					<button className={styles.button}>Let's go</button>
				</div>
			</div>
			<div className={styles.panel_container}>
				<h2>Explore the Alchemy ecosystem</h2>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit.
					Vel similique sed sapiente culpa atque modi distinctio vitae
					omnis, ex fugiat.
				</p>
				<div className={styles.button_container}>
					<button className={styles.button}>Let's go</button>
				</div>
			</div>
			<div className={styles.au_box_container}>
				<div className={styles.au_box}>
					<div className={styles.au_text_container}>
						<h2>Earn your free web3 degree</h2>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipisicing
							elit. Accusantium corporis voluptate incidunt fugit
							dicta, distinctio deserunt ullam cum recusandae
							eaque ipsa, cupiditate porro repellendus illo et aut
							assumenda omnis numquam.
						</p>
					</div>
					<div className={styles.au_button_container}>
						<button className={styles.button}>Let's go</button>
					</div>
				</div>
			</div>
		</div>
	);
}
