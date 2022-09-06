
import { SmartContractStandard } from "./utils/smartContractStandards.js";
import { ERC721smartContractInfo } from "./interfaces/ERC721smartContractInfo.js";
import { SmartContractInfo } from "./interfaces/smartContractInfo.js";

export const generateContractInfo = (
	contractName: string,
	symbol: string,
	standard: SmartContractStandard,
	selectedLibraries: string[]
): SmartContractInfo => {
	let contractInfo: ERC721smartContractInfo = {
		name: contractName,
		symbol: symbol,
		standard: standard,
		isMintable: false,
		isBurnable: false,
		isPausable: false,
		isVotes: false,
		isOwnable: false,
		isRoles: false,
		hasAutoIncrement: false,
		isEnumerable: false,
		hasURIStorage: false,
	};
	for (const library of selectedLibraries) {
		contractInfo[library] = true;
	}
	return contractInfo;
}