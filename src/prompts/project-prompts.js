import chalk from "chalk";
import { CHAIN_CONFIGS, VALID_CHAINS } from "../config/chains.js";

export const projectNamePrompt = {
	type: "input",
	name: "projectName",
	message: "What is your project named?",
	default: "my-web3-dapp",
	validate: (input) => {
		if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
		return "Project name may only include letters, numbers, underscores and hashes.";
	},
};

export const chainPrompt = {
	type: "list",
	name: "chain",
	message: "Which chain would you like to use?",
	choices: CHAIN_CONFIGS.map((chain) => ({
		name: chalk[chain.color](chain.displayName),
		value: chain.id,
	})),
};

export { VALID_CHAINS };
