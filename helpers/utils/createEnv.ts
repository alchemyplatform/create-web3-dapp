import fs from "fs";
import { APIKeys } from "../../interfaces/dappInfo";
import path from "path";

export const createEnv = (
  apiKeys: APIKeys,
  projectPath = "./",
  exposed = true
) => {
  if (Object.keys(apiKeys).length) {
    const writeStream = fs.createWriteStream(path.join(projectPath, ".env"));
    for (const [key, value] of Object.entries(apiKeys)) {
      writeStream.write(
        exposed
          ? `NEXT_PUBLIC_${key.toUpperCase()}= ${value}\n`
          : `${key.toUpperCase()}= ${value}\n`
      );
    }
    writeStream.end();
  }
};
