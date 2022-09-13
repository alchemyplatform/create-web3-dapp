import { ERC20smartContractInfo } from "../../../interfaces/ERC20smartContractInfo.js"
import { SmartContractStandard } from "./smartContractStandards.js";

export function isERC20(arg: any): arg is ERC20smartContractInfo {
	return (
		arg &&
		arg.SmartContractStandard &&
		typeof arg.SmartContractStandard &&
		arg.SmartContractStandard == SmartContractStandard.ERC20
	);
}