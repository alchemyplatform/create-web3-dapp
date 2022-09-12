import { SmartContractInfo } from "../interfaces/smartContractInfo.js";
import { smartContractInfoToDependenciesDictionary } from "../smartContractInfoToDependenciesDictionary.js";

export function getSmartContractSuperClasses(
	smartContractInfo: SmartContractInfo
): string[] {
	const superClasses: string[] = [];
	const standard = smartContractInfo.standard;

	for (const [key, value] of Object.entries(smartContractInfo)) {
		if (typeof value == "boolean" && value) {
			const superClass =
				smartContractInfoToDependenciesDictionary[key][standard]
					.extends;
			if (superClass && !superClasses.includes(superClass)) {
				superClasses.push(superClass);
			}
		}
	}
	return superClasses;
}
