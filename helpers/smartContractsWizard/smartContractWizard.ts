import {
	getAvailableLibrariesForStandard,
	selectLibrariesForStandard,
} from "./getAvailableLibrariesForStandard.js";
import type { SmartContractInfo } from "../../interfaces/smartContractInfo.js";
import { generateContractInfo } from "./generateContractInfo.js";
import type { PromptObject } from "prompts";
import prompts from "prompts";
import checkIfQuit from "../utils/checkIfQuit.js";
import kill from "../utils/kill.js";
import { existsSync } from "fs";
import path from "path";
import { SmartContractStandard } from "./utils/smartContractStandards.js";

interface ContractPromptResponse {
	contractStandard?: SmartContractStandard;
	contractName?: string;
	contractSymbol?: string;
	selectedLibraries?: string[];
	hasCompleted?: boolean;
}

export const smartContractWizard = async (): Promise<SmartContractInfo | undefined> => {
	let quit = false;
	let step = 0;
	let standard: SmartContractStandard | undefined;
	let contractName = "";
	let contractSymbol = "";
	let selectedLibraries: string[] = [];

	while (!quit) {
		switch (step) {
			case 0:
				const standardResponse = await prompts<ContractPromptResponse>({
					type: "select",
					name: "contractStandard",
					message: "Choose your smart contract standard",
					choices: [
						{ title: "ERC721", value: SmartContractStandard.ERC721 },
						{ title: "ERC20", value: SmartContractStandard.ERC20 },
						{ title: "ERC1155", value: SmartContractStandard.ERC1155 },
						{ title: "Quit", value: "quit" },
					],
					hint: "- Space to select. Return to submit",
				});

				standard = standardResponse.contractStandard;
				if (await checkIfQuit(standard, null)) {
					quit = true;
					return;
				}

				if (!standard) {
					kill();
					return;
				}
				step++;
				break;

			case 1:
				const nameResponse = await prompts<ContractPromptResponse>({
					type: "text",
					name: "contractName",
					initial: "MyContract",
					message: "Name for your contract",
				});

				if (!nameResponse.contractName) {
					kill();
					return;
				}

				contractName = nameResponse.contractName.trim().replace(/[\W_]+/g, "-");

				if (
					existsSync(
						path.join(
							process.cwd(),
							"contracts",
							`${contractName}.sol`
						)
					)
				) {
					const retryResponse = await prompts<ContractPromptResponse>({
						type: "text",
						name: "contractName",
						message: "A contract with this name already exists, insert a different name.",
					});

					if (!retryResponse.contractName) {
						kill();
						return;
					}

					contractName = retryResponse.contractName.trim().replace(/[\W_]+/g, "-");
				}
				step++;
				break;

			case 2:
				const symbolResponse = await prompts<ContractPromptResponse>({
					type: "text",
					name: "contractSymbol",
					message: "Symbol for your contract",
					hint: "- typically short version of contract name",
				});

				if (!symbolResponse.contractSymbol) {
					kill();
					return;
				}

				contractSymbol = symbolResponse.contractSymbol.trim().replace(/[\W_]+/g, "");

				if (contractSymbol.length < 3) {
					const retryResponse = await prompts<ContractPromptResponse>({
						type: "text",
						name: "contractSymbol",
						message: "A short version of the name of your smart contract",
						hint: "- symbol should be 3 or more characters",
					});

					if (!retryResponse.contractSymbol) {
						kill();
						return;
					}

					contractSymbol = retryResponse.contractSymbol.trim().replace(/[\W_]+/g, "");
				}
				step++;
				break;

			case 3:
				const librariesForStandard = getAvailableLibrariesForStandard(standard);
				const librariesResponse = await prompts<ContractPromptResponse>({
					type: "multiselect",
					name: "selectedLibraries",
					message: "Select the features you want to add to your contract",
					choices: [...librariesForStandard],
					hint: "- You can select multiple features. Click space to select, return to submit",
				});

				selectedLibraries = librariesResponse.selectedLibraries || [];
				selectLibrariesForStandard(standard, selectedLibraries);
				step++;
				break;

			case 4:
				const completionResponse = await prompts<ContractPromptResponse>({
					type: "toggle",
					name: "hasCompleted",
					message: "Do you want to create another contract?",
					initial: false,
					active: "yes",
					inactive: "no",
				});

				if (completionResponse.hasCompleted) {
					quit = true;
					break;
				}
				step = 0;
				break;
		}
	}

	if (!standard || !contractName || !contractSymbol) {
		return undefined;
	}

	return generateContractInfo(contractName, contractSymbol, standard, selectedLibraries);
};
