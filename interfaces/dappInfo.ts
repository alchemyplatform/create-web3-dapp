import { APIKeys } from "./ApiKeys";

export interface DappInfo {
	chain: string;
	isTemplate: boolean;
	template: number;
	isEVM: boolean;
	isTestnet: boolean;
	testnet?: string;
	useBackend: boolean;
	backendProvider?: string;
	hasSmartContract: boolean;
	modules: string[] | null;
	apiKeys: APIKeys;
}
