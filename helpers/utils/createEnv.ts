import fs from "fs";
import { APIKeys } from "../../interfaces/ApiKeys";
import path from "path";

export const createEnv = (
	apiKeys: APIKeys,
	projectPath = "./",
	local: boolean,
	projectId: string // Add the PROJECT_ID parameter here
) => {
	if (Object.keys(apiKeys).length) {
		const writeStream = fs.createWriteStream(
			path.join(projectPath, local ? ".env.local" : ".env")
		);

		// Write the PROJECT_ID for WalletConnectCloud to the environment file
		if (projectId) {
			writeStream.write(`PROJECT_ID=${projectId}\n`);
		}

		for (const [key, value] of Object.entries(apiKeys)) {
			// Exclude PROJECT_ID from being written again
			if (key !== "PROJECT_ID") {
				writeStream.write(`${key.toUpperCase()}=${value}\n`);
			}
		}
		writeStream.end();
	}
};
