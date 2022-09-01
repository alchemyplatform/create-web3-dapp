import { useState, useEffect } from "react";
import styles from "../../styles/NFTGallery.module.css";


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

const NFTCard = ({ nft }) => {
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
