import chalk from "chalk";
import cliProgress from "cli-progress";
import path from "path";
import { createEnv } from "./createEnv.js";
import fse from "fs-extra";
import { dappInfo } from "../interfaces/dappInfo.js";

export const setUpHardhat = (dappInfo: dappInfo) => {
  const bar2 = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  );
  bar2.start(100, 0);
  bar2.update(50);

  const hardhatTemplate = path.join(process.cwd(), "templates", "hardhat");
  fse.mkdirSync(path.join(process.cwd(), "backend"));
  fse.copySync(hardhatTemplate, path.join(process.cwd(), "backend"));

  if (dappInfo.apiKeys) {
    createEnv(dappInfo.apiKeys, path.join(process.cwd(), "backend"));
  }

  bar2.update(100);
  bar2.stop();
  console.log(chalk.green("Smart Contract Development Environment copied ✅"));
};
