import path from "path";
import fs, { existsSync } from "fs";
import { mkdir } from "../utils/mkdir.js";
import { SmartContractInfo } from "../../interfaces/SmartContractInfo.js";
import {
	generateDeploymentScript,
} from "./generateDeploymentScript.js";
import { SmartContractStandard } from "./utils/smartContractStandards.js";

export const createDeployScript = (
	smartContractInfo: SmartContractInfo,
	backendFolder: string
) => {
	const scriptsFolder = path.join(backendFolder, "scripts");
	if (!existsSync(scriptsFolder)) mkdir(scriptsFolder);

	if (!existsSync(scriptsFolder)) mkdir(scriptsFolder);

	const writeStream = fs.createWriteStream(
		path.join(scriptsFolder, `${smartContractInfo.name}_deploy.js`)
	);
	const content = generateDeploymentScript(smartContractInfo.name);

	writeStream.write(content);
	writeStream.end();
};
