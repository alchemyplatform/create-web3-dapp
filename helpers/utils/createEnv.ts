import fs from "fs";
import { APIKeys } from "../../interfaces/ApiKeys";
import path from "path";

export const createEnv = (
	apiKeys: APIKeys,
	projectPath = "./",
	local: boolean,
) => {
	if (Object.keys(apiKeys).length) {
		const writeStream = fs.createWriteStream(
			path.join(projectPath, local? ".env.local" : ".env")
		);
	
		for (const [key, value] of Object.entries(apiKeys)) {
			writeStream.write(`${key.toUpperCase()}=${value}\n`);
		}
		writeStream.end();
	}
};
