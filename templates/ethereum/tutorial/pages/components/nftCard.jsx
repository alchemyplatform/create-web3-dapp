import styles from "../../styles/NFTCard.module.css";

export const NFTCard = ({ nft }) => {
	return (
		<div id={nft.id} className={styles.card_container}>
			<div className={styles.image_container}>
				<img className={styles.image} src={nft.media[0].gateway}></img>
			</div>

			<div className={styles.text_container}>
				<h4 className={styles.title}>{nft.title}</h4>
				<p className={styles.id}>{nft.id}</p>
				<p className={styles.description}>{nft.description}</p>
			</div>
		</div>
	);
};
