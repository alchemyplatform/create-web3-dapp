import styles from "../../styles/NftGallery.module.css";
import { NFTCard } from "./nftCard";

export const NFTGallery = ({ nftsData }) => {
	return (
		<div className={styles.nft_gallery}>
			{nftsData ? (
				nftsData.map((NFT) => {
					return <NFTCard nft={NFT} />;
				})
			) : (
				<p>No NFTs to show</p>
			)}
		</div>
	);
};
