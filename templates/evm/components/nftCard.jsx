import useComponentVisible from "../../hooks/useComponentVisible";
import styles from "../../styles/NftCard.module.css";
import { PrimaryButton } from "./primaryButton"
import { NFTDetailsPopUp } from "./nftDetailsPopUp";
export const NFTCard = ({ nft }) => {
	const {ref, isComponentVisible, setIsComponentVisible} = useComponentVisible()
	return (
		<div id={nft.id} className={styles.card_container}>
			<div className={styles.image_container}>
				<img
					className={styles.nft_image}
					src={nft.media[0] && nft.media[0].gateway ? nft.media[0].gateway  : "" }
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
				<PrimaryButton text={"More"} onClickCallback={()=>{setIsComponentVisible(true)}}></PrimaryButton>
			</div>
			<div ref={ref}>
				<NFTDetailsPopUp nft={nft} isOpen={isComponentVisible} setIsOpen={setIsComponentVisible}></NFTDetailsPopUp>
			</div>
		</div>
	);
};

