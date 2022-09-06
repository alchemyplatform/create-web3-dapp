import { SmartContractInfo } from "./smartContractInfo.js";
export interface ERC721smartContractInfo extends SmartContractInfo {
	hasAutoIncrement: boolean;
	isEnumerable: boolean;
	hasURIStorage: boolean;
}
