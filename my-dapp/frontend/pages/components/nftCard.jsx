import styles from "../../styles/NftCard.module.css";
import { NFTDetailsPopUp } from "./nftDetailsPopUp";
import useComponentVisible  from "../../hooks/useComponentVisible"

export const NFTCard = ({ nft }) => {
	const {isComponentVisible, setIsComponentVisible, ref} = useComponentVisible()
	return (
		<div id={nft.id} className={styles.card_container}>
			<div className={styles.image_container}>
				<img
					className={styles.nft_image}
					src={nft.media[0].gateway}
				></img>
			</div>

			<div className={styles.text_container}>
				<h4 ref={ref} className={styles.title}>{nft.title}</h4>
				<p className={styles.id}>{nft.id}</p>
				<p className={styles.description}>
					{nft.description.slice(0, 80)}
				</p>
			</div>
			<div className={styles.card_button_container}>
				<PrimaryButton text={"More"} onClickCallback={()=>setIsComponentVisible(true)}></PrimaryButton>
			</div>
			<NFTDetailsPopUp nft={nft} isOpen={isComponentVisible} setIsOpen={setIsComponentVisible} ></NFTDetailsPopUp>
		</div>
	);
};

