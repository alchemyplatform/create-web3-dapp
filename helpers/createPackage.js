import fs from "fs";
import { execSync } from "child_process";
import chalk from "chalk";
import cliProgress from "cli-progress";

export const createPackageJson = async (isEthereumProject, projectName) => {
  try {
    console.log(chalk.yellow("Generating package.json"));
    const bar1 = new cliProgress.SingleBar(
      {},
      cliProgress.Presets.shades_classic
    );
    bar1.start(200, 0);

    let packageJson = {
      name: projectName,
      version: "0.1.0",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "next lint",
      },
      dependencies: {
        next: "12.2.3",
        react: "18.2.0",
        "react-dom": "18.2.0",
      },
      devDependencies: {
        eslint: "8.20.0",
        "eslint-config-next": "12.2.3",
      },
    };
    bar1.update(100);
    if (isEthereumProject) {
      packageJson["dependencies"]["alchemy-sdk"] = "^2.0.0";
      packageJson["dependencies"]["@rainbow-me/rainbowkit"] = "^0.4.5";
    } else {
      packageJson["dependencies"]["@project-serum/borsh"] = "^0.2.5";
      packageJson["dependencies"]["@solana/wallet-adapter-react-ui"] =
        "^0.9.11";
      packageJson["dependencies"]["@solana/wallet-adapter-phantom"] = "^0.9.8";
      packageJson["dependencies"]["@solana/wallet-adapter-react"] = "^0.15.8";
      packageJson["dependencies"]["@solana/wallet-adapter-base"] = "^0.17.0";
      packageJson["dependencies"]["@solana/web3.js"] = "^1.50.1";
    }
    
    bar1.update(150);
    fs.writeFileSync(
      "package.json",
      JSON.stringify(packageJson, null, "\t"),
      (err) => {
        if (err) console.log(err);
      }
    );
    bar1.update(200);
    bar1.stop();
    console.log(chalk.green("Package.json generated"));
    console.log(chalk.yellow("Installing dependencies..."));
    execSync("npm install");
    console.log(chalk.green("Dependencies installed"));
  } catch (e) {}
};
