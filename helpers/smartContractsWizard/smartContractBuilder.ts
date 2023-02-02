import fs, { existsSync } from "fs";
import { generateERC721Template } from "./ERC721Template.js";
import path from "path";
import { SmartContractInfo } from "../../interfaces/SmartContractInfo.js";
import { getSmartContractDependencies } from "./utils/getSmartContractDependencies.js";
import { getSmartContractSuperClasses } from "./utils/getSmartContractSuperClasses.js";
import { isERC721 } from "./utils/isERC721.js";
import { mkdir } from "../utils/mkdir.js";
import { createDeployScript } from "./createDeployScript.js";
export const buildSmartContract = (smartContractInfo: SmartContractInfo, backendFolder: string) => {
	const contractsFolder = path.join(backendFolder, "contracts")
	if (!existsSync(contractsFolder))
		mkdir(contractsFolder);
	const writeStream = fs.createWriteStream(
		path.join(
			contractsFolder,
			`${smartContractInfo.name}.sol`
		)
	);

	const dependencies = getSmartContractDependencies(smartContractInfo);
	const licenseIdentifier = "//SPDX-License-Identifier: MIT";
	const pragmaDeclaration = "pragma solidity ^0.8.4;";

	if (isERC721(smartContractInfo)) {
		const smartContractTemplate = generateERC721Template(
			smartContractInfo,
			getSmartContractSuperClasses(smartContractInfo)
		);
		writeStream.write(`${licenseIdentifier}
${pragmaDeclaration}
${dependencies.join("\n")}

${smartContractTemplate}
    `);
	}
	writeStream.end();

	createDeployScript(smartContractInfo, backendFolder);
};
