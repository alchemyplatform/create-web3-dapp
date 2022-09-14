import { SmartContractInfo } from "./SmartContractInfo.js";
import { ERC721smartContractInfo } from "../interfaces/ERC721smartContractInfo.js";
import { ERC20smartContractInfo } from "./ERC20smartContractInfo.js";
import { DappInfo } from "./DappInfo.js";

export interface BuilderContext {
	contractInfo:
		| SmartContractInfo
		| ERC721smartContractInfo
		| ERC20smartContractInfo
		| undefined;
	dappInfo: DappInfo;
	projectName: string;
	resolvedProjectPath: string;
}


export default BuilderContext;
