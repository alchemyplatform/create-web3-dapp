import chalk from "chalk";
import path from "path";
import fs from "fs";

export const generatePackageDotJson = (
	projectName,
	isEVM,
	useBackend,
	backendProvider,
	hasSmartContract,
	contractName?
) => {
	console.log(chalk.yellow("Generating package.json..."));

	const packageJsonTemplate = {
		name: projectName,
		version: "0.1.0",
		private: true,
		scripts: {},
		dependencies: {},
		devDependencies: {},
	};
	const frontEndPackageJson = JSON.parse(JSON.stringify(packageJsonTemplate));
	frontEndPackageJson["dependencies"]["next"] = "13.1.2";
	frontEndPackageJson["dependencies"]["react"] = "18.2.0";
	frontEndPackageJson["dependencies"]["react-dom"] = "18.2.0";
	frontEndPackageJson["scripts"]["dev"] = "next dev";
	frontEndPackageJson["scripts"]["build"] = "next build";
	frontEndPackageJson["scripts"]["start"] = "next start";
	frontEndPackageJson["scripts"]["lint"] = "next link";
	frontEndPackageJson["devDependencies"]["eslint"] = "8.20.0";
	frontEndPackageJson["devDependencies"]["eslint-config-next"] = "12.2.3";

	if (isEVM) {
		frontEndPackageJson["dependencies"]["alchemy-sdk"] = "^2.3.0";
		frontEndPackageJson["dependencies"]["@rainbow-me/rainbowkit"] =
			"^0.8.1";
	} else {
		frontEndPackageJson["dependencies"]["@project-serum/borsh"] = "^0.2.5";
		frontEndPackageJson["dependencies"]["@solana/wallet-adapter-react-ui"] =
			"^0.9.19-rc.4";
		frontEndPackageJson["dependencies"]["@solana/wallet-adapter-phantom"] =
			"^0.9.8";
		frontEndPackageJson["dependencies"]["@solana/wallet-adapter-react"] =
			"^0.15.21-rc.4";
		frontEndPackageJson["dependencies"]["@solana/wallet-adapter-base"] =
			"^0.9.9";
		frontEndPackageJson["dependencies"]["@solana/web3.js"] = "^1.58.0";
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

	console.log(chalk.green("1/x Package.json generated ✅"));
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
				backendPackageJson["dependencies"]["dotenv"] = "^16.0.2";
				backendPackageJson["scripts"]["build"] = "npx hardhat compile";
				backendPackageJson["scripts"][
					"deploy-testnet"
				] = `npx hardhat run ./scripts/${
					hasSmartContract
						? `${contractName}_deploy.js`
						: "YOUR_DEPLOY_SCRIPT"
				} --network ETH_GOERLI`;
				backendPackageJson["scripts"][
					"deploy"
				] = `npx hardhat run ./scripts/${
					hasSmartContract
						? `${contractName}_deploy.js`
						: "YOUR_DEPLOY_SCRIPT"
				} --network ETH_MAINNET`;
				backendPackageJson["scripts"]["node"] = `npx hardhat node`;
				backendPackageJson["scripts"][
					"deploy-local"
				] = `npx hardhat run ./scripts/${
					hasSmartContract
						? `${contractName}_deploy.js`
						: "YOUR_DEPLOY_SCRIPT"
				} --network localhost`;

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
		if (hasSmartContract) {
			backendPackageJson["dependencies"]["@openzeppelin/contracts"] =
				"^4.7.3";
		}

		fs.writeFileSync(
			path.join(process.cwd(), "backend", "package.json"),
			JSON.stringify(backendPackageJson, null, "\t")
		);
		console.log("2/2 Package.json generated ✅");
	}
};
