import {
	getAvailableLibrariesForStandard,
	selectLibrariesForStandard,
} from "./getAvailableLibrariesForStandard.js";
import { SmartContractInfo } from "../../interfaces/SmartContractInfo.js";
import { generateContractInfo } from "./generateContractInfo.js";
import prompts from "prompts";
import checkIfQuit from "../utils/checkIfQuit.js";
import kill from "../utils/kill.js";
import { existsSync } from "fs";
import path from "path";
import { SmartContractStandard } from "./utils/smartContractStandards.js";

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
							value: SmartContractStandard.ERC721,
							description: "Create a NFTs smart contract",
						},
						{
							title: "ERC20",
							value: SmartContractStandard.ERC20,
							description:
								"Create a crypto currency smart contract",
						},
						{
							title: "ERC1155",
							value: SmartContractStandard.ERC1155,
							description:
								"Create fungible agnosting smart contract",
						},
						{
							title: "ERC721A",
							value: "ERC721A",
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
				} else if (!standard) {
					kill();
				}

				step++;
				break;
			case 1:
				contractName = await prompts({
					type: "text",
					name: "contractName",
					initial: `MyContract`,
					message: "Name for you contract",
				}).then((data) => {
					if (data.contractName) {
						return data.contractName.trim().replace(/[\W_]+/g, "-");
					} else {
						kill();
					}
				});
				const contractIndex = 1;
				while (
					existsSync(
						path.join(
							process.cwd(),
							"contracts",
							`${contractName}.sol`
						)
					)
				) {
					contractName = await prompts({
						type: "text",
						name: "contractName",
						initial: `MyContract_${contractIndex}`,
						message:
							"A contract with this name already exists, insert a different name.",
					}).then((data) => {
						if (data.contractName) {
							return data.contractName
								.trim()
								.replace(/[\W_]+/g, "-");
						} else {
							kill();
						}
					});
				}
				step++;
				break;
			case 2:
				symbol = await prompts({
					type: "text",
					name: "contractSymbol",
					initial: contractName.slice(0, 3).toUpperCase(),
					message: "Symbol for your contract",
					hint: "- typically short version of contract name",
				}).then((data) => {
					if (data.contractSymbol) {
						return data.contractSymbol
							.trim()
							.replace(/[\W_]+/g, "-");
					}
				});
				while (!symbol || !symbol.length || symbol.length < 3) {
					symbol = await prompts({
						type: "text",
						name: "contractSymbol",
						initial: contractName.slice(0, 3).toUpperCase(),
						message:
							"A short version of the name of your smart contract",
						hint: "- symbol should be 3 or more characters",
					}).then((data) => {
						if (data.contractSymbol) {
							return data.contractSymbol
								.trim()
								.replace(/[\W_]+/g, "-");
						} else {
							kill();
						}
					});
				}

				step++;
				break;
			case 3:
				const librariesForStandard =
					getAvailableLibrariesForStandard(standard);
				const selectedLibraries = await prompts({
					type: "multiselect",
					name: "selectedLibraries",
					message: "Smart contract features to implement",
					choices: [...librariesForStandard],
					hint: "- You can select multiple features. Click space to select, return to submit",
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
					message: "Are you done selecting contract features?",
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
