import path from "path";
import fs, { existsSync } from "fs";
import { mkdir } from "../utils/mkdir.js";
import type { SmartContractInfo } from "../../interfaces/smartContractInfo.js";
import { SmartContractStandard } from "./utils/smartContractStandards.js";

const generateFoundryScript = (name: string): string => {
	return `// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/${name}.sol";

contract Deploy${name} is Script {
	function run() external {
		uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
		vm.startBroadcast(deployerPrivateKey);

		${name} contract_ = new ${name}();

		vm.stopBroadcast();
	}
}`;
};

const generateHardhatScript = (name: string): string => {
	return `
const hre = require("hardhat");

async function main() {
	const Contract = await hre.ethers.getContractFactory("${name}");
	const contract = await Contract.deploy();

	await contract.deployed();

	console.log("${name} deployed to:", contract.address);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
`.trim();
};

export const createDeployScript = (
	smartContractInfo: SmartContractInfo,
	backendFolder: string
): void => {
	const scriptsFolder = path.join(backendFolder, "script");
	if (!existsSync(scriptsFolder)) {
		mkdir(scriptsFolder);
	}

	const isFoundry = fs.existsSync(path.join(backendFolder, "foundry.toml"));
	const scriptContent = isFoundry
		? generateFoundryScript(smartContractInfo.name)
		: generateHardhatScript(smartContractInfo.name);

	const scriptExtension = isFoundry ? "s.sol" : "js";
	const scriptPath = path.join(
		scriptsFolder,
		`Deploy_${smartContractInfo.name}.${scriptExtension}`
	);

	fs.writeFileSync(scriptPath, scriptContent);
};
