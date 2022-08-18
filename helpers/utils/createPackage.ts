import fs from "fs";
import { execSync } from "child_process";
import chalk from "chalk";
import cliProgress from "cli-progress";
import { selfDestroy } from "./selfDestroy.js";
import {copyFile} from "./copyFile.js"
interface packageData {
	isEVM: boolean;
	useBackend: boolean;
	backendProvider?: string;
}

export const createPackageJson = async (
	projectName: string,
	{ isEVM, useBackend, backendProvider = "" }: packageData
) => {
	try {
		console.log(chalk.yellow("Generating package.json\n"));
		const bar1 = new cliProgress.SingleBar(
			{},
			cliProgress.Presets.shades_classic
		);
		bar1.start(300, 0);

		const packageJson = {
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
		bar1.update(50);

		if (isEVM) {
			packageJson["dependencies"]["alchemy-sdk"] = "^2.0.0";
			packageJson["dependencies"]["@rainbow-me/rainbowkit"] = "^0.4.5";
		} else {
			packageJson["dependencies"]["@project-serum/borsh"] = "^0.2.5";
			packageJson["dependencies"]["@solana/wallet-adapter-react-ui"] =
				"^0.9.11";
			packageJson["dependencies"]["@solana/wallet-adapter-phantom"] =
				"^0.9.8";
			packageJson["dependencies"]["@solana/wallet-adapter-react"] =
				"^0.15.8";
			packageJson["dependencies"]["@solana/wallet-adapter-base"] =
				"^0.9.9";
			packageJson["dependencies"]["@solana/web3.js"] = "^1.50.1";
		}

		if (useBackend) {
			switch (backendProvider) {
				case "hardhat":
					packageJson["devDependencies"][
						"@nomicfoundation/hardhat-toolbox"
					] = "^1.0.2";
					packageJson["devDependencies"]["hardhat"] = "^2.10.1";
					break;
				case "foundry":
					console.log(
						"It will be soon released - reverting to Hardhat as of now"
					);
					packageJson["devDependencies"][
						"@nomicfoundation/hardhat-toolbox"
					] = "^1.0.2";
					packageJson["devDependencies"]["@hardhat"] = "^2.10.1";
					break;
				default:
					break;
			}
		}

		bar1.update(100);
		fs.writeFileSync(
			"package.json",
			JSON.stringify(packageJson, null, "\t")
		);
		bar1.update(200);
		

		console.log(chalk.green("Package.json generated\n"));
		execSync("npx npm-check-updates -u")
		bar1.update(250);
		console.log(chalk.yellow("Checking dependencies for updates...\n"));
		console.log(chalk.yellow("Installing dependencies...\n"));
		execSync("npm install");
		bar1.update(300);
		console.log(chalk.green("Dependencies installed\n"));
		bar1.stop();

		copyFile("utils", ".eslintrc", process.cwd())
		copyFile("utils", "README.md", process.cwd())
	} catch (e) {
		selfDestroy();
	}
};
