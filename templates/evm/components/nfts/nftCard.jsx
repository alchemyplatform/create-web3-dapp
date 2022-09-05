import styles from "../../styles/NftCard.module.css";

export const NFTCard = ({ nft }) => {
	return (
		<div id={nft.id} className={styles.card_container}>
			<div className={styles.image_container}>
				<img
					className={styles.nft_image}
					src={nft.media[0].gateway}
				></img>
			</div>

			<div className={styles.text_container}>
				<h4 className={styles.title}>{nft.title}</h4>
				<p className={styles.id}>{nft.id}</p>
				<p className={styles.description}>
					{nft.description.slice(0, 80)}
				</p>
			</div>
			<div className={styles.card_button_container}>
				<PrimaryButton text={"More"}></PrimaryButton>
			</div>
		</div>
	);
};

const PrimaryButton = ({ onClickCallback, href, text, newPage = true }) => {
	return (
		<div className={styles.button_container}>
			<a
				className={styles.button}
				onClick={() => onClickCallback()}
				href={href}
				target={newPage ?? "_blank"}
			>
				{text}
			</a>
		</div>
	);
};
