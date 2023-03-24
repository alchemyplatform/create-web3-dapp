import { SmartContractInfo } from "./SmartContractInfo.js";

export interface ERC20smartContractInfo extends SmartContractInfo {
	isFlashMint: boolean;
	isSnapshots: boolean;
	// supplyCap: number;
}
