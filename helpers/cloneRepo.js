import { selfDestroy } from "./selfDestroy.js";
import { execSync } from "child_process";
import path from "path";
import fse from "fs-extra";
import chalk from "chalk";
import cliProgress from "cli-progress";

export const cloneRepo = (
  projectPath,
  isEthereumProject,
  wantsTemplateFiles,
  backendInfo
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

    bar1.update(100);

    console.log(chalk.yellow("Copying project files..."));

    let template = path.join(
      process.cwd(),
      "templates",
      isEthereumProject ? "ethereum" : "solana",
      wantsTemplateFiles ? "tutorial" : "vanilla"
    );

    fse.copySync(template, process.cwd());

    bar1.update(200);
    console.log(chalk.green("Project files copied ✅"));

    bar1.stop();

    if (backendInfo.wantsBackend) {
      console.log(chalk.yellow(`Copying ${backendInfo.type} files...`));
      const bar2 = new cliProgress.SingleBar(
        {},
        cliProgress.Presets.shades_classic
      );
      bar2.start(100, 0);
      bar2.update(50);

      switch (backendInfo.type) {
        case "hardhat":
          let hardhatTemplate = path.join(
            process.cwd(),
            "templates",
            "hardhat"
          );
          fse.mkdirSync(path.join(process.cwd(), "backend"));
          fse.copySync(hardhatTemplate, path.join(process.cwd(), "backend"));
          break;
        case "foundry":
          break;
      }

      bar2.update(100);
      bar2.stop();
      console.log(
        chalk.green("Smart Contract Development Environment copied ✅")
      );
    }
  } catch (e) {
    selfDestroy(e);
  }
};
