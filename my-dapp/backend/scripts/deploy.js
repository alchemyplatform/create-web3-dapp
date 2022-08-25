const hre = require("hardhat");

async function main() {
	const NFTCollection = await hre.ethers.getContractFactory("MyToken");
	const nftCollection = await NFTCollection.deploy()
	await nftCollection.deployed();

	console.log("NFT COLLECTION DEPLOYED AT::", nftCollection.address);
}


main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
