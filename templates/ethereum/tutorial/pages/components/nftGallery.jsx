import { useState, useEffect } from "react";
import styles from "../../styles/NFTGallery.module.css";
import { NFTCard } from "./nftCard";
export const NFTGallery = ({ alchemy, address }) => {
	const [NFTs, setNFTs] = useState();
	useEffect(() => {
		(async () => {
			if (address) {
				console.log("looking for nfts");
				const nfts = await alchemy.nft
					.getNftsForOwner(address)
					.then((data) => data.ownedNfts);
				setNFTs(nfts);
			} else {
				setNFTs();
			}
		})();
	}, [address]);

	return (
		<div className={styles.nft_gallery}>
			{NFTs ? (
				NFTs.slice(0, 3).map((NFT) => {
					return <NFTCard nft={NFT} />;
				})
			) : (
				<p>Connect your wallet to see your NFTs</p>
			)}
		</div>
	);
};
