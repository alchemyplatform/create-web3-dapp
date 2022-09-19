import { useState, useEffect } from "react";
import styles from "../../styles/NftGallery.module.css";
import { NFTCard } from "./nftCard";

export const NFTGallery = ({ address, nftsData }) => {
	const [NFTs, setNFTs] = useState();

	if (nftsData) {
		setNFTs(nftsData);
	}

	useEffect(() => {
		(async () => {
			if (address && !nftsData) {
				const nfts = await fetch("/api/getNftsForOwner", {
					method: "POST",
					body: JSON.stringify({ address: address }),
				}).then((data) => data.json());

				if (nfts) {
					setNFTs(nfts);
					return;
				}
			}
			setNFTs();
		})();
	}, [address]);

	return (
		<div className={styles.nft_gallery}>
			{NFTs ? (
				NFTs.map((NFT) => {
					return <NFTCard nft={NFT} />;
				})
			) : (
				<p>Connect your wallet to see your NFTs</p>
			)}
		</div>
	);
};
