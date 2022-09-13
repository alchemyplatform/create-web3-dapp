import { mkdir } from "../utils/mkdir.js";
import path from "path";
import fs from "fs"
import { SmartContractInfo } from "./interfaces/smartContractInfo.js";
import chalk from "chalk";
import { isERC721 } from "./utils/isERC721.js";
import { generateERC721DeploymentScript } from "./generateERC721DeploymentScript.js";

export const createDeployScript = (smartContractInfo: SmartContractInfo) => {
	console.log(chalk.yellow("Creating Smart Contracts..."));
	mkdir(path.join(process.cwd(), "backend", "scripts"));
	const writeStream = fs.createWriteStream(
		path.join(
			process.cwd(),
			"backend",
			"scripts",
			`${smartContractInfo.name}_deploy.js`
		)
    );

    if (isERC721(smartContractInfo)) {
        generateERC721DeploymentScript(smartContractInfo.name)
    }
    

};
