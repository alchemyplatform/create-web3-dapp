import fs from "fs";

export const createEnv = (keys, path) => {
  let env = {};

  if (keys.alchemyKey) {
    env["NEXT_PUBLIC_ALCHEMY_API_KEY"] = "demo";
  }
  if (Object.keys(env).length) {
    let writeStream = fs.createWriteStream(path.join(path,".env"));
    for (const [key, value] of Object.entries(env)) {
      writeStream.write(`NEXT_PUBLIC_${key.toUpperCase()}= ${value}`);
    }
    writeStream.end();
  }
};
