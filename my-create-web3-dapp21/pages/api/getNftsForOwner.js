import { Network, Alchemy, NftFilters } from "alchemy-sdk";

export default async function handler(req, res) {
	const { address, pageSize, chain, excludeFilter, pageKey } = JSON.parse(
		req.body
	);
	console.log(chain);
	if (req.method !== "POST") {
		res.status(405).send({ message: "Only POST requests allowed" });
		return;
	}

	const settings = {
		apiKey: process.env.ALCHEMY_API_KEY,
		network: Network[chain],
	};

	const alchemy = new Alchemy(settings);

	try {
		const nfts = await alchemy.nft.getNftsForOwner(address, {
			pageSize: pageSize ? pageSize : 100,
			excludeFilters: excludeFilter && [NftFilters.SPAM],
			pageKey: pageKey ? pageKey : "",
		});

		const formattedNfts = nfts.ownedNfts.map((nft) => {
			const { contract, title, tokenType, tokenId, description, media } =
				nft;

			return {
				contract: contract.address,
				symbol: contract.symbol,
				collectionName: contract.openSea?.collectionName,
				media: media[0]?.gateway
					? media[0]?.gateway
					: "https://via.placeholder.com/500",
				verified: contract.openSea?.safelistRequestStatus,
				tokenType,
				tokenId,
				title,
				description,
			};
		});

		res.status(200).json({ nfts: formattedNfts, pageKey: nfts.pageKey });
	} catch (e) {
		console.warn(e);
		res.status(500).send({
			message: "something went wrong, check the log in your terminal",
		});
	}
}
