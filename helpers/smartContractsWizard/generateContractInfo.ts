import { SmartContractStandard } from "./utils/smartContractStandards.js";
import { ERC721smartContractInfo } from "../../interfaces/ERC721smartContractInfo.js";
import { SmartContractInfo } from "../../interfaces/SmartContractInfo.js";
import { ERC20smartContractInfo } from "../../interfaces/ERC20smartContractInfo.js";
import { ERC1155smartContractInfo } from "../../interfaces/ERC1155smartContractInfo.js";

export const generateContractInfo = (
	contractName: string,
	symbol: string,
	standard: SmartContractStandard,
	selectedLibraries: string[]
): SmartContractInfo => {
	const name = `${contractName.slice(0, 1).toUpperCase()}${contractName.slice(
		1
	)}`;
	let contractInfo:
		| ERC721smartContractInfo
		| ERC1155smartContractInfo
		| ERC20smartContractInfo;
	switch (standard) {
		case SmartContractStandard.ERC721:
			contractInfo = {
				name,
				symbol: symbol,
				standard: standard,
				isMintable: true,
				isBurnable: false,
				isPausable: false,
				isVotes: false,
				isOwnable: false,
				isRoles: false,
				isAutoIncrement: true,
				isEnumerable: false,
				isURIStorage: false,
			};
			break;
		case SmartContractStandard.ERC20:
			contractInfo = {
				name,
				symbol: symbol,
				standard: standard,
				isMintable: true,
				isBurnable: false,
				isPausable: false,
				isVotes: false,
				isFlashMint: false,
				isSnapshots: false,
				isOwnable: false,
				isRoles: false,
			};
			break;
		case SmartContractStandard.ERC1155:
			contractInfo = {
				name,
				symbol: symbol,
				standard: standard,
				isMintable: true,
				isBurnable: false,
				isPausable: false,
				isVotes: false,
				isOwnable: false,
				isRoles: false,
				supply: true,
			};
			break;
	}

	if (selectedLibraries && selectedLibraries.length) {
		for (const library of selectedLibraries) {
			contractInfo[library] = true;
		}
	}

	if (contractInfo.isOwnable && contractInfo.isRoles) {
		contractInfo.isOwnable = false;
	}
	return contractInfo;
};
