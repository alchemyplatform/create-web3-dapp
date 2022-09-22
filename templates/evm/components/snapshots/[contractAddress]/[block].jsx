import styles from "../../../styles/Snapshots.module.css";
import { PrimaryButton } from "../../components/primaryButton";
import { Section } from "../../layout/section";

export async function getServerSideProps({ params }) {
	const { contractAddress, block } = params;
	const contractMetadata = await fetch(
		"http://localhost:3002/api/getContractMetadata",
		{
			method: "POST",
			body: JSON.stringify({ contractAddress: contractAddress }),
		}
	).then((data) => data.json());
	const fetchedOwnerAddresses = await fetch(
		"http://localhost:3002/api/getSnapshot",
		{
			method: "POST",
			body: JSON.stringify({ contractAddress: contractAddress, block: block }),
		}
	).then((data) => data.json());

	if (fetchedOwnerAddresses && contractMetadata) {
		return {
			props: {
				fetchedOwnerAddresses,
				contractMetadata,
			},
		};

	}
	return {
		props: {
			fetchedOwnerAddresses: null,
			contractMetadata: null,
		},
	};
}

export default function SnapshotReview({
	fetchedOwnerAddresses,
	contractMetadata,
}) {
	const downloadTxtFile = () => {
		const element = document.createElement("a");
		const file = new Blob([fetchedOwnerAddresses.join("\n")], {
			type: "text/plain",
		});
		element.href = URL.createObjectURL(file);
		element.download = "wallets.txt";
		document.body.appendChild(element); // Required for this to work in FireFox
		element.click();
	};

	const copyWallets = () => {
		navigator.clipboard
			.writeText(fetchedOwnerAddresses.join("\n"))
			.then(() => {
				alert("Copied to clipboard");
			});
	};

	return (
		<Section>{
			fetchedOwnerAddresses && contractMetadata ? 
			<div className={styles.container}>
				<div className={styles.contract_metadata}>
					<h1>{contractMetadata.name}</h1>

					<p>{contractMetadata.address}</p>
					<div className={styles.contract_info}>
						<p>Symbol: {contractMetadata.symbol}</p>
						<p>Supply: {contractMetadata.totalSupply}</p>
					</div>
				</div>
				<div className={styles.owners_list}>
					{fetchedOwnerAddresses.map((ownerAddress) => (
						<p id={ownerAddress}>{ownerAddress}</p>
					))}
				</div>
				<div className={styles.buttons_container}>
					<PrimaryButton
						text={"Download Wallets"}
						onClickCallback={downloadTxtFile}
					></PrimaryButton>
					<PrimaryButton
						text={"Copy wallets"}
						onClickCallback={copyWallets}
					></PrimaryButton>
				</div>
			</div> : <div>404</div>}
		</Section>
	);
}
