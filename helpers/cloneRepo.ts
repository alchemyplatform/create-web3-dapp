import { selfDestroy } from "./selfDestroy.js";
import { execSync } from "child_process";
import path from "path";
import fse from "fs-extra";
import chalk from "chalk";
import cliProgress from "cli-progress";
import { setUpHardhat } from "./setupHardhat.js";
import { dappInfo } from "../interfaces/dappInfo.js";

export const cloneRepo = (
  projectPath : string,
  dappInfo : dappInfo
) => {
  try {
    process.chdir(projectPath);
    console.log(chalk.yellow("Downloading files..."));
    const bar1 = new cliProgress.SingleBar(
      {},
      cliProgress.Presets.shades_classic
    );
    bar1.start(200, 0);
    console.log("\n");
    execSync(
      `git clone --depth 1 ${"https://github.com/Eversmile12/create-web3-dapp"} .`
    );
    console.log("\n");
    bar1.update(100);

    console.log(chalk.yellow("\nCopying project files..."));



    
    const template = path.join(
      process.cwd(),
      "templates",
      (dappInfo.chain == "ethereum" || dappInfo.chain == "polygon" || dappInfo.chain == "arbitrum"|| dappInfo.chain == "optimism") ? "ethereum" : "solana",
      dappInfo.wantsTemplateFiles ? "tutorial" : "vanilla"
    );
    
    fse.copySync(template, process.cwd());

    bar1.update(200);
    console.log(chalk.green("Project files copied ✅"));

    bar1.stop();

    if (dappInfo.useBackend) {
      console.log(chalk.yellow(`Copying ${dappInfo.backendProvider} files...`));
      switch (dappInfo.backendProvider) {
        case "hardhat":
          setUpHardhat(dappInfo)
          break;
        
        case "foundry":
          break;
        case "Anchor":
          break;
      }
    }
  } catch (e) {
    selfDestroy();
  }
};
