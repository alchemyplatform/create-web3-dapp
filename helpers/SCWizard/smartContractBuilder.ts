import fs from "fs";
import { generateERC721Template } from "./ERC721Template.js";
import path from "path";
import { SmartContractInfo } from "./interfaces/smartContractInfo.js";
import { getSmartContractDependencies } from "./utils/getSmartContractDependencies.js";
import { getSmartContractSuperClasses } from "./utils/getSmartContractSuperClasses.js";
import { isERC721 } from "./utils/isERC721.js";

export const buildSmartContract = (smartContractInfo: SmartContractInfo) => {
	console.log(smartContractInfo);
	console.log("CURRENT DIRECTORY:: ", process.cwd())
	const writeStream = fs.createWriteStream(
		path.join(process.cwd(), "backend", "contracts", "smartContract.sol")
	);

	const dependencies = getSmartContractDependencies(smartContractInfo);
	const licenseIdentifier = "";
	const pragmaDeclaration = "";

	if (isERC721(smartContractInfo)) {
		console.log("generating smart contract");
		const smartContractTemplate = generateERC721Template(
			smartContractInfo,
			getSmartContractSuperClasses(smartContractInfo)
		);
		writeStream.write(`
        ${licenseIdentifier}
        ${pragmaDeclaration}    
        ${dependencies.join("\n")}
        ${smartContractTemplate}
    `);
	}
};
