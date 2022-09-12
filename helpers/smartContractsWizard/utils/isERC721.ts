import { ERC721smartContractInfo } from "../interfaces/ERC721smartContractInfo"
import { SmartContractStandard } from "./smartContractStandards.js";

export function isERC721(
	smartContractInfo: any
): smartContractInfo is ERC721smartContractInfo {
	return (
		smartContractInfo &&
		smartContractInfo.standard &&
		typeof smartContractInfo.standard &&
		smartContractInfo.standard == SmartContractStandard.ERC721
	);
}
