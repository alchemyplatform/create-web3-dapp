import { Component } from "./component";

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
	toolkitType?: string;
	components: [Component] | null;
	apiKeys: APIKeys;
}
