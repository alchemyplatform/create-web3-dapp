import { DappInfo, createDefaultDappInfo } from "../../interfaces/dappInfo.js";

interface Context {
	projectName: string | null;
	resolvedProjectPath: string | null;
	dappInfo: DappInfo;
	contractInfo?: {
		name: string;
		symbol: string;
		standard: string;
		isMintable: boolean;
		isBurnable: boolean;
		isPausable: boolean;
		isVotes: boolean;
		isOwnable: boolean;
		isRoles: boolean;
		[key: string]: unknown;
	};
}

const context: Context = {
	projectName: null,
	resolvedProjectPath: null,
	dappInfo: createDefaultDappInfo()
};

export default context;
