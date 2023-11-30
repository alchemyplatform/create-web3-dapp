"use client";
import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import Navbar from "../components/instructionsComponent/navigation/navbar";
import Footer from "../components/instructionsComponent/navigation/footer";

const config = createConfig(
	getDefaultConfig({
		// Required API Keys
		alchemyId: process.env.ALCHEMY_API_KEY, // or infuraId
		walletConnectProjectId: "demo",

		// Required
		appName: "You Create Web3 Dapp",

		// Optional
		appDescription: "Your App Description",
		appUrl: "https://family.co", // your app's url
		appIcon: "https://family.co/logo.png", // your app's logo,no bigger than 1024x1024px (max. 1MB)
	})
);

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<WagmiConfig config={config}>
				<ConnectKitProvider mode="dark">
					<body>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								minHeight: "105vh",
							}}
						>
							<Navbar />
							<div style={{ flexGrow: 1 }}>{children}</div>
							<Footer />
						</div>
					</body>
				</ConnectKitProvider>
			</WagmiConfig>
		</html>
	);
}
