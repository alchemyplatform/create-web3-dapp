import fs from "fs";
import { APIKeys } from "../../interfaces/apiKeys";
import path from "path";

export const createEnv = (
	apiKeys: APIKeys,
	projectPath = "./",
) => {
	if (Object.keys(apiKeys).length) {
		const writeStream = fs.createWriteStream(
			path.join(projectPath, ".env")
		);
		writeStream.on("error", function (e) {
			console.error(e);
		});
		console.log(`CREATING ENV FILE in ${projectPath}`);
		for (const [key, value] of Object.entries(apiKeys)) {
			console.log(key, value);
			writeStream.write(`${key.toUpperCase()}= ${value}\n`);
		}
		writeStream.end();
	}
};
