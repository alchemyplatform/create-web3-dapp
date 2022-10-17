import {
	getAvailableLibrariesForStandard,
	selectLibrariesForStandard,
} from "./getAvailableLibrariesForStandard.js";
import { SmartContractInfo } from "../../interfaces/SmartContractInfo.js";
import { generateContractInfo } from "./generateContractInfo.js";
import prompts from "prompts";

export const smartContractWizard = async (): Promise<
	SmartContractInfo | undefined
> => {
	let contractName = await prompts({
		type: "text",
		name: "contractName",
		initial: `MyContract`,
		message: "Choose a name for your contract",
	}).then((data) => data.contractName.trim().replace(/[\W_]+/g, "-"));


	let standard = await prompts({
		type: "select",
		name: "contractStandard",
		message: "What kind of smart contract do you want to create?",
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
		],
		hint: "- Space to select. Return to submit",
	}).then((data) => data.contractStandard);
	while (!standard.length) {
		const quit = await prompts({
			type: "select",
			name: "quit",
			message:
				"A standard must be selected to continue - do you want to exit the smart contract wizard?",
			choices: [
				{
					title: "Yes",
					value: true,
					description: "Exit smart contract Wizard",
				},
				{
					title: "No",
					value: false,
					description: "Go back to Smart Contract creation",
				},
			],
			hint: "- Space to select. Return to submit",
		}).then((data) => data.quit);

		if (!quit) {
			standard = await prompts({
				type: "select",
				name: "contractStandard",
				message: "What kind of smart contract do you want to create?",
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
				],
				hint: "- Space to select. Return to submit",
			}).then((data) => data.contractStandard);
		} else {
			return;
		}
	}
	while (contractName.length < 3) {
		contractName = await prompts({
			type: "text",
			name: "contractName",
			initial: `MyContract`,
			message:
				"Choose a name for your contract - Name must be longer than 3 character",
		}).then((data) => data.contractName.trim().replace(/[\W_]+/g, "-"));
	}
	const symbol = await prompts({
		type: "text",
		name: "contractSymbol",
		initial: contractName.slice(0, 3).toUpperCase(),
		message: "A short version of the name of your smart contract",
	}).then((data) => data.contractSymbol.trim().replace(/[\W_]+/g, ""));

	const librariesForStandard = getAvailableLibrariesForStandard(standard);
	const selectedLibraries = await prompts({
		type: "multiselect",
		name: "selectedLibraries",
		message: "Select the features you want to implement",
		choices: [...librariesForStandard],
		hint: "- Space to select. Return to submit",
	}).then((data) => data.selectedLibraries);

    selectLibrariesForStandard(standard, selectedLibraries);
    
	return generateContractInfo(
		contractName,
		symbol,
		standard,
		selectedLibraries
	);
};
