import path from "path";
import fs, { existsSync } from "fs";
import { mkdir } from "../utils/mkdir.js";
import { SmartContractInfo } from "../../interfaces/SmartContractInfo.js";
import { isERC721 } from "./utils/isERC721.js";
import { generateERC721DeploymentScript } from "./generateERC721DeploymentScript.js";

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
	let content;

	if (isERC721(smartContractInfo)) {
		content = generateERC721DeploymentScript(smartContractInfo.name);
	}

	writeStream.write(content);
	writeStream.end();
};
