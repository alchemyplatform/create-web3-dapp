import fs from "fs";
import { generateERC721Template } from "./ERC721Template.js";
import path from "path";
import { SmartContractInfo } from "./interfaces/smartContractInfo.js";
import { getSmartContractDependencies } from "./utils/getSmartContractDependencies.js";
import { getSmartContractSuperClasses } from "./utils/getSmartContractSuperClasses.js";
import { isERC721 } from "./utils/isERC721.js";
import chalk from "chalk";
import { mkdir } from "../utils/mkdir.js";
import {createDeployScript} from "./createDeployScript.js"
export const buildSmartContract = (smartContractInfo: SmartContractInfo) => {
	console.log(chalk.yellow("Creating Smart Contracts..."));
	mkdir(path.join(process.cwd(), "backend", "contracts"));
	const writeStream = fs.createWriteStream(
		path.join(
			process.cwd(),
			"backend",
			"contracts",
			`${smartContractInfo.name}.sol`
		)
	);

	const dependencies = getSmartContractDependencies(smartContractInfo);
	const licenseIdentifier = "//SPDX-License-Identifier: MIT";
	const pragmaDeclaration = "pragma solidity ^0.8.4;";

	if (isERC721(smartContractInfo)) {
		console.log("Generating NFTs Smart contracts...");
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
	writeStream.end();

	console.log(chalk.green("Smart contract created ✅"));

	createDeployScript(smartContractInfo);
};
