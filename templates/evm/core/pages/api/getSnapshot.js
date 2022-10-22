// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import alchemy from "../utils/alchemy";

export default async function handler(req, res) {
	const { method } = req;

	if (method == "POST") {
		const { contractAddress, block } = JSON.parse(req.body);
		if (contractAddress) {
			const { owners } = await alchemy.nft.getOwnersForContract(
				contractAddress,
				block
			);
			res.status(200).json(owners);
		} else {
			res.status(500).json({ error: "Missing contract address" });
		}

		return;
	}
	res.status(400).json({ error: "Request not supported" });
	return;
}
