import styles from "../../styles/NftDetailsPopUp.module.css";
import { useState, useEffect } from "react";

export const NFTDetailsPopUp = ({ nft, owner, isOpen, setIsOpen }) => {
	const [contractMetadata, setContractMetadata] = useState();
	useEffect(() => {
		(async () => {
			if (nft.contract.address) {
				const nfts = await fetch("/api/getContractMetadata", {
					method: "POST",
					body: JSON.stringify({
						contractAddress: nft.contract.address,
					}),
				}).then((data) => data.json());

				if (nfts) {
					setContractMetadata(nfts);
					return;
				}
			}
			setContractMetadata();
		})();
	}, []);

	return (
		<div
			className={`${styles.nftDetails_container} ${
				isOpen ? "" : styles.close
			}`}
		>
			{contractMetadata && <p>{contractMetadata.name}</p>}
			<h2 className={styles.title}>
				{nft.title} #{nft.tokenId}
			</h2>

			<div className={styles.nftDetails_flexbox}>
				<img
					className={styles.nftImage}
					src={nft.media[0].gateway}
				></img>
				<div className={styles.metadata_container}>
					<div>
						<h3>Description</h3>
						<p className={styles.description}>{nft.description}</p>
					</div>
					<p>{owner}</p>

					<div>
						<div>
							<h3>Attributes</h3>
						</div>
						<div className={styles.nftAttributes_container}>
							{nft.rawMetadata.attributes.map((attribute) => {
								return (
									<div className={styles.nftAttribute}>
										<p
											className={
												styles.nftAttribute_trait_type
											}
										>
											{attribute.trait_type}
										</p>
										<p
											className={
												styles.nftAttribute_trait_value
											}
										>
											{attribute.value}
										</p>
									</div>
								);
							})}
						</div>
						<div>
						</div>
					</div>
				</div>
			</div>
			<div className={styles.closeButton}>
				<a onClick={() => setIsOpen(false)}>Close</a>
			</div>
		</div>
	);
};
