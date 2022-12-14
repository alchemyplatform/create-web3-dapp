import "../styles/globals.css";
import {
	ConnectionProvider,
	WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import * as web3 from "@solana/web3.js";
import { useMemo } from "react";

function MyApp({ Component, pageProps }) {
	const endpoint = web3.clusterApiUrl("devnet");
	const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

	return (
		<ConnectionProvider endpoint={endpoint}>
			<WalletProvider wallets={wallets}>
				<WalletModalProvider>
					<Component {...pageProps} />
				</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	);
}

export default MyApp;
