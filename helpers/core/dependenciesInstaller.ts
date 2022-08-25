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

export const installDependencies = async (
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
		const frontEndPackageJson = JSON.parse(
			JSON.stringify(packageJsonTemplate)
		);
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
		if (useBackend) {
			fs.writeFileSync(
				path.join("frontend", "package.json"),	
				JSON.stringify(frontEndPackageJson, null, "\t")
			);
		} else {
			fs.writeFileSync(
				"package.json",
				JSON.stringify(frontEndPackageJson, null, "\t")
			);
		}
		
		console.log("\n1/x Package.json generated ✅");
		bar1.update(150);

		if (useBackend) {
			const backendPackageJson = JSON.parse(
				JSON.stringify(packageJsonTemplate)
			);
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
				console.log("2/2 Package.json generated ✅");
				console.log(
					chalk.yellow("Installing Hardhat dependencies...\n")
				);
				process.chdir("backend");
				execSync("npx npm-check-updates -u");
				execSync("npm install");
				console.log("Hardhat dependencies installed ✅");
				bar1.update(200);
			}
		}
		if (useBackend) {
			process.chdir(path.join("frontend",resolvedProjectPath));
		} else {
			process.chdir(resolvedProjectPath);
		}
		console.log(chalk.yellow("\nChecking dependencies for updates..."));
		execSync("npx npm-check-updates -u");
		bar1.update(250);
		console.log(chalk.yellow("\nInstalling dependencies..."));
		execSync("npm install");
		bar1.update(300);
		console.log("\n Dependencies installed ✅");
		bar1.stop();		
		copyFile("utils", "README.md", process.cwd())
	} catch (e) {
		selfDestroy(e);
	}
};
