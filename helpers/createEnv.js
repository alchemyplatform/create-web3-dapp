import fs from "fs";

export const createEnv = (alchemyAPIKey) => {
  let env = {};

  if (alchemyAPIKey) {
    env["NEXT_PUBLIC_ALCHEMY_API_KEY"] = "demo";
  }

  if (Object.keys(env).length) {
    let writeStream = fs.createWriteStream(".env");
    for (const [key, value] of Object.entries(env)) {
      writeStream.write(`${key}=${value}`);
    }
    writeStream.end();
  }
};
