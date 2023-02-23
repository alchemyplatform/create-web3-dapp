import { Network, Alchemy } from "alchemy-sdk";

export default async function handler(req, res) {
	const { address, pageKey, pageSize, chain } = JSON.parse(
		req.body
	);
	if (req.method !== "POST") {
		res.status(405).send({ message: "Only POST requests allowed" });
		return;
	}
	console.log(chain);
	const settings = {
		apiKey: process.env.ALCHEMY_API_KEY,
		network: Network[chain],
	};
	const alchemy = new Alchemy(settings);

	try {
		const nfts = await alchemy.nft.getNftsForContract(address, {
			pageKey: pageKey ? pageKey : null,
			pageSize: pageSize ? pageSize : null,
		});
		const formattedNfts = nfts.nfts.map((nft) => {
			const { contract, title, tokenType, tokenId, description, media } =
				nft;

			return {
				contract: contract.address,
				symbol: contract.symbol,
				media: media[0]?.gateway
					? media[0]?.gateway
					: "https://via.placeholder.com/500",
				collectionName: contract.openSea?.collectionName,
				verified: contract.openSea?.safelistRequestStatus,
				tokenType,
				tokenId,
				title,
				description,
			};
		});

		res.status(200).json({
			nfts: formattedNfts,
			pageKey: nfts.pageKey,
		});
		// the rest of your code
	} catch (e) {
		console.warn(e);
		res.status(500).send({
			message: "something went wrong, check the log in your terminal",
		});
	}
}
