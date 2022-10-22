// Next.js API route support: https://nextjs.org/docs/api-routes/introduction


export default async function handler(req, res) {
	const { method } = req;

	if (method == "POST") {
		const { contractAddress, chain } = JSON.parse(req.body);
		const chainEtherscanURL = getEtherscanEndpointURL(chain)
		const url = `${chainEtherscanURL}api?module=contract&action=getabi&address=${contractAddress}&apikey=${process.env.ETHERSCAN_API_KEY}`;

        
		const contractABI = await fetch(url, {
			method: "GET",
		}).then((data) => data.json()).catch(e => {
			res.status(500).json({ message: "Etherscan error, check the service status" })
		});
		res.status(200).json(contractABI);

		return;
	}

	res.status(400).json({ error: "Request not supported" });
}


const getEtherscanEndpointURL = (chain) => {
	switch (chain) {
		case "ETH_MAINNET":
			return "https://api.etherscan.io/"
			break;
		case "ETH_GOERLI":
			return "https://api-goerli.etherscan.io/"
			break;
		case "MATIC_MAINNET":
			return "https://api.polygonscan.com/"
			break;
		case "MATIC_MUMBAI":
			return "https://api.polygonscan.com/"
			break;
	
			
		
		
	}
}