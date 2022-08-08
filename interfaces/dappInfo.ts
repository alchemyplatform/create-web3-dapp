export type APIKeys = {
	alchemy_api_key?: string;
};

export interface dappInfo {
	chain: string;
	isEVM: boolean;
	isTestnet: boolean;
	testnet?: string;
	useBackend: boolean;
	backendProvider?: string;
	wantsTemplateFiles: boolean;
	apiKeys: APIKeys;
}
