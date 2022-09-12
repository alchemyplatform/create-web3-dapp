import { SmartContractInfo } from "./smartContractInfo.js";

export interface ERC20smartContractInfo extends SmartContractInfo {
	premint: number;
	isPermit: boolean;
	isFlashMinting: boolean;
	isSnapshots: boolean;
}
