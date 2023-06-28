import { APIKeys } from "./ApiKeys";

export interface DappInfo {
	chain: string;
	isTemplate: boolean;
	template: string;
	isEVM: boolean;
	isTypescript: boolean;
	testnet: string;
	useBackend: boolean;
	backendProvider?: string;
	hasSmartContract: boolean;
	modules: string[] | null;
	apiKeys: APIKeys;
	storeAnonymisedData?: boolean;
}
