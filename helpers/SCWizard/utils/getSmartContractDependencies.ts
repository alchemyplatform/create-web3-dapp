import { SmartContractInfo } from "../interfaces/smartContractInfo.js";
import { smartContractInfoToDependenciesDictionary } from "../smartContractInfoToDependenciesDictionary.js";
import { SmartContractStandard } from "./smartContractStandards.js";

export function getSmartContractDependencies(
	smartContractInfo: SmartContractInfo
): string[] {
	let libraries: string[] = [];
	const { standard } = smartContractInfo;
	console.log("GETTING DEPENDENCIES FOR", standard);
	switch (standard) {
		case SmartContractStandard.ERC20:
			libraries.push(`import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
            `);
			break;
		case SmartContractStandard.ERC721:
			console.log("pushing main ERC721 dependencies");
			libraries.push(`import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
            `);
			break;
		default:
			return [];
			break;
	}

	for (const [key, value] of Object.entries(smartContractInfo)) {
		console.log(key, value);

		if (typeof value == "boolean" && value && key != "isMintable") {
			libraries.push(
				smartContractInfoToDependenciesDictionary[key][standard]
					.libraryURL
			);
		}
	}
	console.log("LIBRARIES::");
	console.log(libraries);
	return libraries;
}
