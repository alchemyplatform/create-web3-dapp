
import fs, { existsSync } from "fs";
import path from "path";
import { SmartContractInfo } from "../../interfaces/SmartContractInfo.js";
import { mkdir } from "../utils/mkdir.js";
import { createDeployScript } from "./createDeployScript.js";
import { erc20, erc721, erc1155 } from "@openzeppelin/wizard";
import { CommonOptions } from "@openzeppelin/wizard/dist/common-options.js";
import { SmartContractStandard } from "./utils/smartContractStandards.js";
import { ERC721smartContractInfo } from "../../interfaces/ERC721smartContractInfo.js";
import { ERC20smartContractInfo } from "../../interfaces/ERC20smartContractInfo.js";

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

export const buildSmartContract = (
	smartContractInfo:
		| SmartContractInfo
		| ERC721smartContractInfo
		| ERC20smartContractInfo,
	backendFolder: string
) => {
	const contractsFolder = path.join(backendFolder, "contracts");
	if (!existsSync(contractsFolder)) mkdir(contractsFolder);
	const writeStream = fs.createWriteStream(
		path.join(contractsFolder, `${smartContractInfo.name}.sol`)
	);
	let smartcontractTemplate;
	switch (smartContractInfo.standard) {
		case SmartContractStandard.ERC20:
			smartcontractTemplate = erc20.print({
				name: smartContractInfo.name,
				symbol: smartContractInfo.symbol,
				burnable: smartContractInfo.isBurnable,
				pausable: smartContractInfo.isPausable,
				// permint:"",
				mintable: smartContractInfo.isMintable,
				flashmint: (smartContractInfo as ERC20smartContractInfo)
					.isFlashMint,
				votes: smartContractInfo.isVotes,
				access: smartContractInfo.isOwnable ? "ownable" : "roles",
			});

			break;
		case SmartContractStandard.ERC721:
			smartcontractTemplate = erc721.print({
				name: smartContractInfo.name,
				symbol: smartContractInfo.symbol,
				// baseUri?: string;
				enumerable: (smartContractInfo as ERC721smartContractInfo)
					.isEnumerable,
				uriStorage: (smartContractInfo as ERC721smartContractInfo)
					.isURIStorage,
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
	}
	writeStream.write(smartcontractTemplate);

	writeStream.end();

	createDeployScript(smartContractInfo, backendFolder);
};
