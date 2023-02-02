import { SmartContractStandard } from "./utils/smartContractStandards.js";
import { ERC721smartContractInfo } from "../../interfaces/ERC721smartContractInfo.js";
import { SmartContractInfo } from "../../interfaces/SmartContractInfo.js";

export const generateContractInfo = (
	contractName: string,
	symbol: string,
	standard: SmartContractStandard,
	selectedLibraries: string[]
): SmartContractInfo => {
	const name = `${contractName.slice(0, 1).toUpperCase()}${contractName.slice(
		1
	)}`;
	const contractInfo: ERC721smartContractInfo = {
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
