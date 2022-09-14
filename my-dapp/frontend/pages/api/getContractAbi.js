// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import alchemy from "../alchemy";

export default async function handler(req, res) {
	const { method } = req;

	if (method == "POST") {
		const { contractAddress } = JSON.parse(req.body);
		const url = `https://api-goerli.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${process.env.ETHERSCAN_API_KEY}`;

        console.log(contractAddress);
        
		const contractABI = await fetch(url, {
			method: "GET",
		}).then((data) => data.json());
		res.status(200).json(contractABI);

		return;
	}

	res.status(400).json({ error: "Request not supported" });
}
