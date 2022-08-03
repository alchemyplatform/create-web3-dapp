import { selfDestroy } from "./selfDestroy.js";
import {execSync} from "child_process"
import path from "path";
import fse from "fs-extra"
import chalk from "chalk";
import cliProgress from "cli-progress"

export const cloneRepo = (projectPath, isEthereumProject, wantsTemplateFiles, backendInfo) => {
    try {


    process.chdir(projectPath);
    console.log(chalk.yellow("Downloading files..."));
    const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    bar1.start(200, 0);

    execSync(
      `git clone --depth 1 ${"https://github.com/Eversmile12/create-web3-dapp"} .`
    );
      bar1.update(100)
      
      console.log("WANTS TEMPLATE FILES:: ", wantsTemplateFiles)
    let template = path.join(
      process.cwd(),
      "templates",
      isEthereumProject ? "ethereum" : "solana",
      wantsTemplateFiles ? "tutorial" : "vanilla"
    );
    
      fse.copySync(template, process.cwd());
      
      bar1.update(200)
      bar1.stop();
      
      if (backendInfo.wantsBackend) {
        console.log("Copying backend files...")
        const bar2 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        bar2.start(100, 0);
        let hardhatTemplate = path.join(process.cwd(), "templates", backendInfo.type ? "hardhat" : "hardhat")
        fse.mkdirSync(path.join(process.cwd(), "backend"))
        fse.copySync(hardhatTemplate, path.join(process.cwd(), "backend"));
        // fse.renameSync(path.join(process.cwd(), "hardhat"), path.join(process.cwd(), "backend"))
        bar2.update(100)
        bar2.stop()
        console.log("Finished copying backend files")
      }

  } catch (e) {
        selfDestroy(e)
  }
};
