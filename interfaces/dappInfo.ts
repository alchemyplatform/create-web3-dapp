


export interface dappInfo {
	chain: string;
	isEVM: boolean;
	isTestnet: boolean;
	testnet?: string;
	useBackend: boolean;
	backendProvider?: string;
	toolkitType?: string;
	modules: [string] | null;
	alchemyAPIKey: string | 'demo';
}
