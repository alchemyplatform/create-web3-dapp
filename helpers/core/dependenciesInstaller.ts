import fs from "fs";
import { execSync } from "child_process";
import chalk from "chalk";
import cliProgress from "cli-progress";
import { selfDestroy } from "./selfDestroy.js";
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
		

		generatePackageDotJson(projectName, isEVM, useBackend, backendProvider);
		// TODO: IMPLEMENT OTHER PROVIDERS
		if (backendProvider == "hardhat") {
			console.log(`Installing ${backendProvider.charAt(0).toUpperCase() + backendProvider.slice(1)} dependencies...`)
			const bar1 = new cliProgress.SingleBar(
				{},
				cliProgress.Presets.shades_classic
			);
			bar1.start(100, 0);
			process.chdir("backend");
			bar1.update(50);
			execSync("npx npm-check-updates -u");
			execSync("npm install");
			console.log("Hardhat dependencies installed ✅");
			bar1.update(100);
		}
		const bar2 = new cliProgress.SingleBar(
			{},
			cliProgress.Presets.shades_classic
		);
		if (useBackend) {
			process.chdir(path.join(resolvedProjectPath, "frontend"));
		} else {
			process.chdir(resolvedProjectPath);
		}
		console.log(chalk.yellow("\nChecking dependencies for updates..."));
		execSync("npx npm-check-updates -u");
		bar2.update(50);
		console.log(chalk.yellow("\nInstalling other dependencies..."));
		execSync("npm install");
		bar2.update(200);
		console.log("\n Dependencies installed ✅");
		bar2.stop();

	} catch (e) {
		selfDestroy(e);
	}
};

const generatePackageDotJson = (
	projectName,
	isEVM,
	useBackend,
	backendProvider
) => {
	console.log(chalk.yellow("Generating package.json\n"));
	

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
	const frontEndPackageJson = JSON.parse(JSON.stringify(packageJsonTemplate));
	if (isEVM) {
		frontEndPackageJson["dependencies"]["alchemy-sdk"] = "^2.0.0";
		frontEndPackageJson["dependencies"]["@rainbow-me/rainbowkit"] =
			"^0.4.5";
	} else {
		frontEndPackageJson["dependencies"]["@project-serum/borsh"] = "^0.2.5";
		frontEndPackageJson["dependencies"]["@solana/wallet-adapter-react-ui"] =
			"^0.9.11";
		frontEndPackageJson["dependencies"]["@solana/wallet-adapter-phantom"] =
			"^0.9.8";
		frontEndPackageJson["dependencies"]["@solana/wallet-adapter-react"] =
			"^0.15.8";
		frontEndPackageJson["dependencies"]["@solana/wallet-adapter-base"] =
			"^0.9.9";
		frontEndPackageJson["dependencies"]["@solana/web3.js"] = "^1.50.1";
	}

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

	console.log("1/x Package.json generated ✅");
	if (useBackend) {
		const backendPackageJson = JSON.parse(
			JSON.stringify(packageJsonTemplate)
		);
		switch (backendProvider) {
			case "hardhat":
				backendPackageJson["devDependencies"][
					"@nomicfoundation/hardhat-toolbox"
				] = "^1.0.2";
				backendPackageJson["devDependencies"]["hardhat"] = "^2.10.1";
				break;
			case "foundry":
				console.log(
					"It will be soon released - reverting to Hardhat as of now"
				);
				backendPackageJson["devDependencies"][
					"@nomicfoundation/hardhat-toolbox"
				] = "^1.0.2";
				backendPackageJson["devDependencies"]["@hardhat"] = "^2.10.1";
				break;
			case "anchor":
				break;
			default:
				break;
		}

		fs.writeFileSync(
			path.join(process.cwd(), "backend", "package.json"),
			JSON.stringify(backendPackageJson, null, "\t")
		);
		console.log("2/2 Package.json generated ✅");
	}
};
