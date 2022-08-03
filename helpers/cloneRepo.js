import { selfDestroy } from "./selfDestroy.js";
import {execSync} from "child_process"
import path from "path";
import fse from "fs-extra"
import chalk from "chalk";
import cliProgress from "cli-progress"

export const cloneRepo = (projectPath, isEthereumProject,wantsTemplateFiles) => {
    try {


    process.chdir(projectPath);
    console.log(chalk.yellow("Downloading files..."));
    const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    bar1.start(200, 0);

    execSync(
      `git clone --depth 1 ${"https://github.com/Eversmile12/create-web3-dapp"} .`
    );
    bar1.update(100)
    let template = path.join(
      process.cwd(),
      "templates",
      isEthereumProject ? "ethereum" : "solana",
      wantsTemplateFiles ? "tutorial" : "vanilla"
    );
    
    fse.copySync(template, process.cwd());
        bar1.update(200)
        bar1.stop();

  } catch (e) {
        selfDestroy(e)
  }
};
