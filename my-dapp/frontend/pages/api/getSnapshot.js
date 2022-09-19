// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import alchemy from "../alchemy";

export default async function handler(req, res) {
	const { method } = req;
    
	if (method == "POST") {
		const { contractAddress, block } = JSON.parse(req.body);
		const {owners} = await alchemy.nft.getOwnersForContract(
			contractAddress,
			block
		);
		res.status(200).json(owners);

		return;
	}

	res.status(400).json({ error: "Request not supported" });
}
