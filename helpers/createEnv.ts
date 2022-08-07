import fs from "fs";
import { APIKeys } from "../interfaces/dappInfo";
import path from "path";

export const createEnv = (apiKeys: APIKeys, projectPath = "./") => {

  console.log(apiKeys)

  if (Object.keys(apiKeys).length) {
    const writeStream = fs.createWriteStream(path.join(projectPath, ".env"));
    for (const [key, value] of Object.entries(apiKeys)) {
      writeStream.write(`NEXT_PUBLIC_${key.toUpperCase()}= ${value}`);
    }
    writeStream.end();
  }
};
