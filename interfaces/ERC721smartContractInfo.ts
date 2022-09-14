import { SmartContractInfo } from "./SmartContractInfo.js";
export interface ERC721smartContractInfo extends SmartContractInfo {
	isAutoIncrement: boolean;
	isEnumerable: boolean;
	isURIStorage: boolean;
}
