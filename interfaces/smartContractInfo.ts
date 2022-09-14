import { SmartContractStandard } from "../helpers/smartContractsWizard/utils/smartContractStandards.js";
export interface SmartContractInfo {
	name: string;
	symbol: string;
	standard: SmartContractStandard;
	isMintable: boolean;
	isBurnable: boolean;
	isPausable: boolean;
	isVotes: boolean;
	isOwnable: boolean;
	isRoles: boolean;
}
