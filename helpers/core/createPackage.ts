import fs from "fs";
import { execSync } from "child_process";
import chalk from "chalk";
import cliProgress from "cli-progress";
import { selfDestroy } from "./selfDestroy.js";
import { copyFile } from "../utils/copyFile.js";
import path from "path";
interface packageData {
	isEVM: boolean;
	useBackend: boolean;
	backendProvider?: string;
}

export const createPackageJson = async (
	projectName: string,
	resolvedProjectPath,
	{ isEVM, useBackend, backendProvider = "" }: packageData
) => {
	try {
		console.log(chalk.yellow("Generating package.json\n"));
		const bar1 = new cliProgress.SingleBar(
			{},
			cliProgress.Presets.shades_classic
		);
		bar1.start(300, 0);

		const packageJsonTemplate = {
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
		let frontEndPackageJson = {...packageJsonTemplate};
		if (isEVM) {
			frontEndPackageJson["dependencies"]["alchemy-sdk"] = "^2.0.0";
			frontEndPackageJson["dependencies"]["@rainbow-me/rainbowkit"] =
				"^0.4.5";
		} else {
			frontEndPackageJson["dependencies"]["@project-serum/borsh"] =
				"^0.2.5";
			frontEndPackageJson["dependencies"][
				"@solana/wallet-adapter-react-ui"
			] = "^0.9.11";
			frontEndPackageJson["dependencies"][
				"@solana/wallet-adapter-phantom"
			] = "^0.9.8";
			frontEndPackageJson["dependencies"][
				"@solana/wallet-adapter-react"
			] = "^0.15.8";
			frontEndPackageJson["dependencies"]["@solana/wallet-adapter-base"] =
				"^0.9.9";
			frontEndPackageJson["dependencies"]["@solana/web3.js"] = "^1.50.1";
		}

		bar1.update(100);
		fs.writeFileSync(
			"package.json",
			JSON.stringify(frontEndPackageJson, null, "\t")
		);
		bar1.update(200);

		if (useBackend) {
			let backendPackageJson = {...packageJsonTemplate};
			switch (backendProvider) {
				case "hardhat":
					backendPackageJson["devDependencies"][
						"@nomicfoundation/hardhat-toolbox"
					] = "^1.0.2";
					backendPackageJson["devDependencies"]["hardhat"] =
						"^2.10.1";
					break;
				case "foundry":
					console.log(
						"It will be soon released - reverting to Hardhat as of now"
					);
					backendPackageJson["devDependencies"][
						"@nomicfoundation/hardhat-toolbox"
					] = "^1.0.2";
					backendPackageJson["devDependencies"]["@hardhat"] =
						"^2.10.1";
					break;
				case "anchor":
					break;
				default:
					break;
			}
			// TODO: IMPLEMENT OTHER PROVIDERS
			if (backendProvider == "hardhat") {
				fs.writeFileSync(
					path.join(process.cwd(), "backend", "package.json"),
					JSON.stringify(backendPackageJson, null, "\t")
				);
				process.chdir("backend");
				execSync("npx npm-check-updates -u");
				execSync("npm install");
			}
			
		}

		process.chdir(resolvedProjectPath);
		console.log(chalk.green("Package.json generated\n"));
		execSync("npx npm-check-updates -u");
		bar1.update(250);
		console.log(chalk.yellow("\nChecking dependencies for updates...\n"));
		console.log(chalk.yellow("Installing dependencies...\n"));
		execSync("npm install");
		bar1.update(300);
		console.log(chalk.green("Dependencies installed\n"));
		bar1.stop();

		// copyFile("utils", ".eslintrc", process.cwd())

		// copyFile("utils", "README.md", process.cwd())
	} catch (e) {
		selfDestroy(e);
	}
};
