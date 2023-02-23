import { useEffect, useState } from "react";
import styles from "../styles/NftGallery.module.css";
import { useAccount } from "wagmi";
import etherscan from "../public/etherscan.svg";
import verified from "../public/verified.svg";

export default function NFTGallery({}) {
	const [nfts, setNfts] = useState();
	const [walletOrCollectionAddress, setWalletOrCollectionAddress] =
		useState("vitalik.eth");
	const [fetchMethod, setFetchMethod] = useState("wallet");
	const [pageKey, setPageKey] = useState(false);
	const [spamFilter, setSpamFilter] = useState(true);
	const [isLoading, setIsloading] = useState(false);
	const { address, isConnected } = useAccount();
	const [chain, setChain] = useState("eth-mainnet");
	
	const changeFetchMethod = (e) => {
		switch (e.target.value) {
			case "wallet":
				setWalletOrCollectionAddress("vitalik.eth");

				break;
			case "collection":
				setWalletOrCollectionAddress(
					"0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e"
				);
				break;
			case "connectedWallet":
				setWalletOrCollectionAddress(address);
				break;
		}
		setFetchMethod(e.target.value);
	};
	const fetchNFTs = async (pagekey) => {
		setIsloading(true);
		setNfts();
		const endpoint =
			fetchMethod == "wallet" || fetchMethod == "connectedWallet"
				? "/api/getNftsForOwner"
				: "/api/getNftsForCollection";
		try {
			const res = await fetch(endpoint, {
				method: "POST",
				body: JSON.stringify({
					address:
						fetchMethod == "connectedWallet"
							? address
							: walletOrCollectionAddress,
					pageKey: pagekey ? pagekey : null,
					chain: chain,
					excludeFilter: spamFilter,
				}),
			}).then((res) => res.json());
			setNfts(res.nfts);
			if (res.pageKey) {
				setPageKey(res.pageKey);
			} else {
				setPageKey();
			}
		} catch (e) {}

		setIsloading(false);
	};

	useEffect(() => {
		fetchNFTs();
	}, [fetchMethod]);
	useEffect(() => {
		fetchNFTs();
	}, [spamFilter]);

	return (
		<div className={styles.nft_gallery_page}>
			<div>
				<div className={styles.fetch_selector_container}>
					<h2 style={{ fontSize: "20px" }}>Explore NFTs by</h2>
					<div className={styles.select_container}>
						<select
							defaultValue={"wallet"}
							onChange={(e) => {
								changeFetchMethod(e);
							}}
						>
							<option value={"wallet"}>wallet</option>
							<option value={"collection"}>collection</option>
							<option value={"connectedWallet"}>
								connected wallet
							</option>
						</select>
					</div>
				</div>
				<div className={styles.inputs_container}>
					<div className={styles.input_button_container}>
					<input
				value={walletOrCollectionAddress}
				onChange={(e) => {
					setWalletOrCollectionAddress(e.target.value);
				}}
				placeholder="Insert NFTs contract or wallet address"
			></input>
						<div className={styles.select_container_alt}>
							<select
								onChange={(e) => {
									setChain(e.target.value);
								}}
								defaultValue={"ETH_MAINNET"}
							>
								<option value={"ETH_MAINNET"}>Mainnet</option>
								<option value={"MATIC_MAINNET"}>Polygon</option>
								<option value={"ETH_GOERLI"}>Goerli</option>
								<option value={"MATIC_MUMBAI"}>Mumbai</option>
							</select>
						</div>
						<div
							onClick={() => fetchNFTs()}
							className={styles.button_black}
						>
							<a>Search</a>
						</div>
					</div>
				</div>
			</div>

			{isLoading ? (
				<div className={styles.loading_box}>
					<p>Loading...</p>
				</div>
			) : (
				<div className={styles.nft_gallery}>
					{(nfts?.length &&
						fetchMethod !=
							"collection")&&(
								<div
									style={{
										display: "flex",
										gap: ".5rem",
										width: "100%",
										justifyContent: "end",
									}}
								>
									<p>Hide spam</p>
									<label className={styles.switch}>
										<input
											onChange={(e) =>
												setSpamFilter(e.target.checked)
											}
											checked={spamFilter}
											type="checkbox"
										/>
										<span
											className={`${styles.slider} ${styles.round}`}
										></span>
									</label>
								</div>
							)}

					<div className={styles.nfts_display}>
						{nfts?.length ? (
							nfts.map((nft) => {
								return <NftCard key={nft.tokenId} nft={nft} />;
							})
						) : (
							<div className={styles.loading_box}>
								<p>No NFTs found for the selected address</p>
							</div>
						)}
					</div>
				</div>
			)}

			{pageKey && nfts?.length && (
				<div>
					<a
						className={styles.button_black}
						onClick={() => {
							fetchNFTs(pageKey);
						}}
					>
						Load more
					</a>
				</div>
			)}
		</div>
	);
}
function NftCard({ nft }) {
	return (
		<div className={styles.card_container}>
			<div className={styles.image_container}>
				<img src={nft.media}></img>
			</div>
			<div className={styles.info_container}>
				<div className={styles.title_container}>
					<h3>{nft.title}</h3>
				</div>
				<hr className={styles.separator} />
				<div className={styles.symbol_contract_container}>
					<div className={styles.symbol_container}>
						<p>{nft.symbol}</p>

						{nft.verified == "verified" ? (
							<img
								src={verified.src}
								width="20px"
								height="20px"
							/>
						) : null}
					</div>
					<div className={styles.contract_container}>
						<p className={styles.contract_container}>
							{nft.contract.slice(0, 6)}...
							{nft.contract.slice(38)}
						</p>
						<img src={etherscan.src} width="15px" height="15px" />
					</div>
				</div>

				<div className={styles.description_container}>
					<p>{nft.description}</p>
				</div>
			</div>
		</div>
	);
}
