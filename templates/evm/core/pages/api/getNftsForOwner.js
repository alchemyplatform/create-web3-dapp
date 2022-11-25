// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import alchemy from "../../utils/alchemy";

export default async function handler(req, res) {
	const { method } = req;

	if (method == "POST") {
		const { address } = JSON.parse(req.body);
		if (address) {
			const nfts = await alchemy.nft
				.getNftsForOwner(address)
				.then((data) => data.ownedNfts);
			res.status(200).json(nfts);
		} else {
			res.status(500).json({ error: "Missing contract address" });
		}

		return;
	}

	res.status(400).json({ error: "Request not supported" });
	return;
}
