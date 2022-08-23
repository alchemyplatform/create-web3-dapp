import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Panel } from "./components/panels";
import { Section } from "./layout/section";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
require("@solana/wallet-adapter-react-ui/styles.css");
import { useEffect, useState } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as web3 from "@solana/web3.js";

export default function Home() {
	const { connection } = useConnection();
	const { publicKey, sendTransaction } = useWallet();
	const [balance, setBalance] = useState();
	const [recipientAddress, setRecipientAddress] = useState();
	const [amount, setAmount] = useState();
	const [transactionSignature, setTransactionSignature] = useState();

	useEffect(() => {
		if (!connection || !publicKey) {
			return;
		}
		console.log(connection);
		connection.getAccountInfo(publicKey).then((info) => {
			if (info) {
				setBalance(info.lamports / LAMPORTS_PER_SOL);
			}
		});
	}, [connection, publicKey]);

	const handleTransaction = async () => {
		const transaction = new web3.Transaction();
		const sendSolInstruction = web3.SystemProgram.transfer({
			fromPubkey: publicKey,
			toPubkey: recipientAddress,
			lamports: web3.LAMPORTS_PER_SOL * amount,
		});
		transaction.add(sendSolInstruction);
		sendTransaction(transaction, connection);
		const signature = await sendTransaction(transaction, connection);

		setTransactionSignature(signature);
	};

	return (
		<div>
			<header className={styles.header_container}>
				<div className={styles.navbar}>
					<WalletMultiButton />
					{balance && <p>{balance} SOL</p>}
				</div>
				<div className={styles.logo_container}>
					<Image
						src={"/logo.svg"}
						width="150"
						height="150"
						alt="Alchemy logo"
					></Image>
					<h1>Welcome to Web3</h1>
					<p>Get started by editing pages/index.js</p>
				</div>
			</header>
			<main className={styles.main}>
				<Section>
					<Panel></Panel>
				</Section>
				<Section title={"Send a transaction"}>
					<p>
						{`alchemy.ws.once(
                {
                  method: 'alchemy_pendingTransactions',
                  toAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
                },
                res => console.log(res)
              );`}
					</p>
					<div>
						<input
							type="text"
							value={recipientAddress}
							onChange={(e) =>
								setRecipientAddress(e.target.value)
							}
							placeholder="wallet address"
						></input>
						<input
							type="text"
							value={publicKey}
							disabled={true}
						></input>
						<input
							type="text"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							placeholder="Amount in Lamports"
						></input>
						<button
							onClick={() => {
								handleTransaction();
							}}
						>
							Send SOL
						</button>
						{transactionSignature && (
							<p>
								Transaction confirmed, check it on{" "}
								<a
									href={`https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`}
								>
									The Solana Explorer
								</a>
							</p>
						)}
					</div>
				</Section>
			</main>
		</div>
	);
}
