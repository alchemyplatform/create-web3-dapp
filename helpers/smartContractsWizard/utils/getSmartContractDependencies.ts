import { SmartContractInfo } from "../interfaces/smartContractInfo.js";
import { smartContractInfoToDependenciesDictionary } from "../smartContractInfoToDependenciesDictionary.js";
import { SmartContractStandard } from "./smartContractStandards.js";

export function getSmartContractDependencies(
	smartContractInfo: SmartContractInfo
): string[] {
	const libraries: string[] = [];
	const { standard } = smartContractInfo;
	switch (standard) {
		case SmartContractStandard.ERC20:
			libraries.push(`import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
            `);
			break;
		case SmartContractStandard.ERC721:
			libraries.push(`import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
            `);
			break;
		default:
			return [];
			break;
	}

	for (const [key, value] of Object.entries(smartContractInfo)) {
		if (typeof value == "boolean" && value) {
			libraries.push(
				smartContractInfoToDependenciesDictionary[key][standard]
					.libraryURL
			);
		}
	}

	return libraries;
}
