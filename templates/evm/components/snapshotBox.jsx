import { useState } from "react";
import { PrimaryButton } from "./primaryButton";
import { useRouter } from "next/router";
import styles from "../../styles/SnapshotBox.module.css";

export const SnapshotBox = () => {
	const [address, setAddress] = useState("");
	const [block, setBlock] = useState("");
	const router = useRouter();

	const goToSnapshot = () => {
		if (address) {
			router.push(`/snapshots/${address}/${block ? block : "latest"}`);
		}
	};

	return (
		<div className={styles.form_container}>
			<input
				className={styles.form_input}
				type={"text"}
				placeholder="Insert address"
				value={address}
				onChange={(e) => {
					setAddress(e.target.value);
				}}
			/>
			<input
				className={styles.form_input}
				type={"text"}
				placeholder="Insert block number - leave blank for 'latest'"
				value={block}
				onChange={(e) => {
					setBlock(e.target.value);
				}}
			/>
			<PrimaryButton
				text={"Snapshot!"}
				onClickCallback={goToSnapshot}
			></PrimaryButton>
		</div>
	);
};
