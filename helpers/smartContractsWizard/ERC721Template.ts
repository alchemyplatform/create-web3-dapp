import { Access, erc721 } from "@openzeppelin/wizard";

export const generateERC721Template = (smartContractInfo) => {
	let access: Access = false;
	if (smartContractInfo.isRoles) {
		access = 'roles';
	} else if (smartContractInfo.isOwnable) {
		access = 'ownable';
	}

	return erc721.print({
		name: smartContractInfo.name,
		symbol: smartContractInfo.symbol,
		mintable: smartContractInfo.isMintable,
		burnable: smartContractInfo.isBurnable,
		pausable: smartContractInfo.isPausable,
		votes: smartContractInfo.isVotes,
		access: access,
		incremental: smartContractInfo.isAutoIncrement,
		enumerable: smartContractInfo.isEnumerable,
		uriStorage: smartContractInfo.isURIStorage,
	});
};
