import {
	getAvailableLibrariesForStandard,
	selectLibrariesForStandard,
} from "./getAvailableLibrariesForStandard.js";
import { SmartContractInfo } from "../../interfaces/SmartContractInfo.js";
import { generateContractInfo } from "./generateContractInfo.js";
import prompts from "prompts";
import checkIfQuit from "../utils/checkIfQuit.js";
export const smartContractWizard = async (): Promise<
	SmartContractInfo | undefined
> => {
	let step = 0;
	let contractInfo;
	let contractName;
	let standard;
	let symbol;
	let quit = false;
	while (!quit) {
		switch (step) {
			case 0:
				standard = await prompts({
					type: "select",
					name: "contractStandard",
					message:
						"What kind of smart contract do you want to create?",
					choices: [
						{
							title: "ERC721",
							value: "ERC721",
							description: "Create a NFTs Smart Contract",
						},
						{
							title: "ERC721A",
							value: "ERC721A",
							disabled: true,
							description: "Coming soon",
						},
						{
							title: "ERC1155",
							value: "ERC1155",
							disabled: true,
							description: "Coming soon",
						},
						{
							title: "ERC20",
							value: "ERC20",
							disabled: true,
							description: "Coming soon",
						},
						{
							title: "Quit",
							value: "quit",
							description: "Quit smart contract wizard",
						},
					],
					hint: "- Space to select. Return to submit",
				}).then((data) => data.contractStandard);
				if (await checkIfQuit(standard, null)) {
					quit = true;
					return;
				}
				while (!standard.length) {
					standard = await prompts({
						type: "select",
						name: "contractStandard",
						message:
							"What kind of smart contract do you want to create?",
						choices: [
							{
								title: "ERC721",
								value: "ERC721",
								description: "Create a NFTs Smart Contract",
							},
							{
								title: "ERC20",
								value: "ERC20",
								disabled: true,
								description: "Create a Token Smart Contract",
							},
							{
								title: "Quit",
								value: "quit",
								description: "Quit smart contract wizard",
							},
						],
						hint: "- Space to select. Return to submit",
					}).then((data) => data.contractStandard);
				}
				if (await checkIfQuit(standard, null)) {
					quit = true;
					return;
				}
				step++;
				break;
			case 1:
				contractName = await prompts({
					type: "text",
					name: "contractName",
					initial: `MyContract`,
					message: "Choose a name for your contract",
				}).then((data) =>
					data.contractName.trim().replace(/[\W_]+/g, "-")
				);

				step++;
				break;
			case 2:
				symbol = await prompts({
					type: "text",
					name: "contractSymbol",
					initial: contractName.slice(0, 3).toUpperCase(),
					message:
						"A short version of the name of your smart contract",
				}).then((data) =>
					data.contractSymbol.trim().replace(/[\W_]+/g, "")
				);
				while (!symbol.length) {
					const quit = await prompts({
						type: "text",
						name: "contractName",
						initial: `MyContract`,
						message: "A contract symbol must be choosen",
					}).then(
						(data) =>
							(contractName = data.contractName
								.trim()
								.replace(/[\W_]+/g, "-"))
					);
				}

				while (symbol.length < 3) {
					contractName = await prompts({
						type: "text",
						name: "contractName",
						initial: `MyContract`,
						message:
							"Choose a symbol for your contract - Sybol is usually of 3 or more characters",
					}).then((data) =>
						data.contractName.trim().replace(/[\W_]+/g, "-")
					);
				}
				step++;
				break;
			case 3:
				const librariesForStandard =
					getAvailableLibrariesForStandard(standard);
				const selectedLibraries = await prompts({
					type: "multiselect",
					name: "selectedLibraries",
					message: "Select the features you want to implement",
					choices: [...librariesForStandard],
					hint: "- Space to select. Return to submit",
				}).then((data) => data.selectedLibraries);

				selectLibrariesForStandard(standard, selectedLibraries);

				contractInfo = generateContractInfo(
					contractName,
					symbol,
					standard,
					selectedLibraries
				);
				step++;
				break;
			case 4:
				const hasCompleted = await prompts({
					type: "toggle",
					name: "hasCompleted",
					message: "Have you completed ?",
					initial: true,
					active: "yes",
					inactive: "no",
				}).then((data) => data.hasCompleted);
				if (hasCompleted) {
					quit = true;
					break;
				} else {
					step--;
					break;
				}
		}
	}
	return contractInfo;
};
