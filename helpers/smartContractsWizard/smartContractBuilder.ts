import fs, { existsSync } from "fs";
import path from "path";
import type { SmartContractInfo } from "../../interfaces/smartContractInfo.js";
import { mkdir } from "../utils/mkdir.js";
import { createDeployScript } from "./createDeployScript.js";
import { erc20, erc721, erc1155 } from "@openzeppelin/wizard";
import type { CommonOptions } from "@openzeppelin/wizard/dist/common-options.js";
import { SmartContractStandard } from "./utils/smartContractStandards.js";
import type { ERC721smartContractInfo } from "../../interfaces/ERC721smartContractInfo.js";
import type { ERC20smartContractInfo } from "../../interfaces/ERC20smartContractInfo.js";
import { execSync } from "child_process";

export interface ERC20Options extends CommonOptions {
	name: string;
	symbol: string;
	burnable?: boolean;
	snapshots?: boolean;
	pausable?: boolean;
	premint?: string;
	mintable?: boolean;
	permit?: boolean;
	votes?: boolean;
	flashmint?: boolean;
}

export interface ERC721Options extends CommonOptions {
	name: string;
	symbol: string;
	baseUri?: string;
	enumerable?: boolean;
	uriStorage?: boolean;
	burnable?: boolean;
	pausable?: boolean;
	mintable?: boolean;
	incremental?: boolean;
	votes?: boolean;
}

export interface ERC1155Options extends CommonOptions {
	name: string;
	uri: string;
	burnable?: boolean;
	pausable?: boolean;
	mintable?: boolean;
	supply?: boolean;
	updatableUri?: boolean;
}

const initializeFoundry = (backendFolder: string) => {
	try {
		// Check if Foundry is installed
		execSync("forge --version", { stdio: "ignore" });
	} catch {
		console.log("Installing Foundry...");
		execSync("curl -L https://foundry.paradigm.xyz | bash", { stdio: "inherit" });
		execSync(". ~/.bashrc && foundryup", { stdio: "inherit" });
	}

	// Initialize Foundry project
	process.chdir(backendFolder);
	execSync("forge init --force", { stdio: "inherit" });

	// Add OpenZeppelin contracts
	execSync("forge install OpenZeppelin/openzeppelin-contracts", { stdio: "inherit" });

	// Create remappings.txt for OpenZeppelin imports
	fs.writeFileSync(
		"remappings.txt",
		'@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/'
	);
};

export const buildSmartContract = (
	smartContractInfo: SmartContractInfo | ERC721smartContractInfo | ERC20smartContractInfo,
	backendFolder: string
): void => {
	const contractsFolder = path.join(backendFolder, "src");
	if (!existsSync(contractsFolder)) {
		mkdir(contractsFolder);
	}

	// Initialize Foundry project
	initializeFoundry(backendFolder);

	const writeStream = fs.createWriteStream(
		path.join(contractsFolder, `${smartContractInfo.name}.sol`)
	);

	let smartcontractTemplate: string;
	switch (smartContractInfo.standard) {
		case SmartContractStandard.ERC20:
			smartcontractTemplate = erc20.print({
				name: smartContractInfo.name,
				symbol: smartContractInfo.symbol,
				burnable: smartContractInfo.isBurnable,
				pausable: smartContractInfo.isPausable,
				mintable: smartContractInfo.isMintable,
				flashmint: (smartContractInfo as ERC20smartContractInfo).isFlashMint,
				votes: smartContractInfo.isVotes,
				access: smartContractInfo.isOwnable ? "ownable" : "roles",
			});
			break;

		case SmartContractStandard.ERC721:
			smartcontractTemplate = erc721.print({
				name: smartContractInfo.name,
				symbol: smartContractInfo.symbol,
				enumerable: (smartContractInfo as ERC721smartContractInfo).isEnumerable,
				uriStorage: (smartContractInfo as ERC721smartContractInfo).isURIStorage,
				burnable: smartContractInfo.isBurnable,
				pausable: smartContractInfo.isPausable,
				mintable: smartContractInfo.isMintable,
				incremental: true,
				votes: smartContractInfo.isVotes,
				access: smartContractInfo.isOwnable ? "ownable" : "roles",
			});
			break;

		case SmartContractStandard.ERC1155:
			smartcontractTemplate = erc1155.print({
				name: smartContractInfo.name,
				uri: "",
				burnable: smartContractInfo.isBurnable,
				pausable: smartContractInfo.isPausable,
				mintable: smartContractInfo.isMintable,
				supply: true,
				access: smartContractInfo.isOwnable ? "ownable" : "roles",
			});
			break;

		default:
			throw new Error(`Unsupported contract standard: ${smartContractInfo.standard}`);
	}

	writeStream.write(smartcontractTemplate);
	writeStream.end();

	// Create Foundry deployment script
	createDeployScript(smartContractInfo, backendFolder);

	// Create test file
	const testFolder = path.join(backendFolder, "test");
	if (!existsSync(testFolder)) {
		mkdir(testFolder);
	}

	const testStream = fs.createWriteStream(
		path.join(testFolder, `${smartContractInfo.name}.t.sol`)
	);

	testStream.write(`// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/${smartContractInfo.name}.sol";

contract ${smartContractInfo.name}Test is Test {
	${smartContractInfo.name} public contract_;

	function setUp() public {
		contract_ = new ${smartContractInfo.name}();
	}

	function test_initialization() public {
		assertEq(contract_.name(), "${smartContractInfo.name}");
		assertEq(contract_.symbol(), "${smartContractInfo.symbol}");
	}
}
`);
	testStream.end();
};
