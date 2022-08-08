import "../styles/globals.css";
import {
	ConnectionProvider,
	WalletProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import * as web3 from "@solana/web3.js";

function MyApp({ Component, pageProps }) {
	const endpoint = web3.clusterApiUrl("devnet");
	const wallet = new PhantomWalletAdapter();

	return (
		<ConnectionProvider endpoint={endpoint}>
			<WalletProvider wallets={[wallet]}>
				<Component {...pageProps} />
			</WalletProvider>
		</ConnectionProvider>
	);
}

export default MyApp;
