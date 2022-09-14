// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import alchemy from "..alchemy";

export default async function handler(req, res) {
	const { method } = req;

	if (method == "POST") {
		const { address } = JSON.parse(req.body);

		const nfts = await alchemy.nft
			.getNftsForOwner(address)
			.then((data) => data.ownedNfts);
		res.status(200).json(nfts);

		return;
	}

	res.status(400).json({ error: "Request not supported" });
}
