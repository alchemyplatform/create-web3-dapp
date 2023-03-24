const hre = require("hardhat");

async function main() {
	const Contract = await hre.ethers.getContractFactory("Test");
	const contract = await Contract.deploy();

	await contract.deployed();

	console.log("Test deployed to:", contract.address);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});