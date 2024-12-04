import { ChainType } from "../helpers/core/workflows/templatesWorkflow.js";

export interface DappInfo {
	isTemplate: boolean;
	template?: string;
	chain?: string;
	chainType?: ChainType;
	testnet?: string;
	useBackend: boolean;
	backendProvider?: "foundry" | "hardhat";
	isTypescript: boolean;
	hasSmartContract: boolean;
	apiKeys: Record<string, string>;
}

export const createDefaultDappInfo = (): DappInfo => ({
	isTemplate: false,
	useBackend: false,
	isTypescript: true, // Default to TypeScript
	hasSmartContract: false,
	apiKeys: {}
});
