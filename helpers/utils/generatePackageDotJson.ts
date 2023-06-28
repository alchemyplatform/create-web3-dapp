import path from "path";
import fs from "fs";

export const generatePackageDotJson = (
	projectName,
	isEVM,
	testnet,
	useBackend,
	backendProvider,
	hasSmartContract,
	chain,
	contractName?
) => {
	const packageJsonTemplate = {
		name: projectName,
		version: "0.1.0",
		private: true,
		scripts: {},
		dependencies: {},
		devDependencies: {},
	};
	// const frontEndPackageJson = JSON.parse(JSON.stringify(packageJsonTemplate));
	// frontEndPackageJson["scripts"]["dev"] = "next dev";
	// frontEndPackageJson["scripts"]["build"] = "next build";
	// frontEndPackageJson["scripts"]["start"] = "next start";
	// frontEndPackageJson["scripts"]["lint"] = "next lint";
	// frontEndPackageJson["scripts"]["marketplace"] =
	// 	"npx create-web3-dapp marketplace";
	// frontEndPackageJson["dependencies"]["next"] = "13.1.2";
	// frontEndPackageJson["dependencies"]["react"] = "18.2.0";
	// frontEndPackageJson["dependencies"]["react-dom"] = "18.2.0";
	// frontEndPackageJson["devDependencies"]["eslint"] = "8.42.0";
	// frontEndPackageJson["devDependencies"]["eslint-config-next"] = "13.4.4";
	// frontEndPackageJson["dependencies"]["alchemy-sdk"] = "^2.6.2";
	// frontEndPackageJson["dependencies"]["@rainbow-me/rainbowkit"] = "^0.12.4";
	// frontEndPackageJson["dependencies"]["wagmi"] = "^0.12.6";
	// if (isTypescript) {
	// 	frontEndPackageJson["dependencies"]["typescript"] = "5.1.3";
	// 	frontEndPackageJson["dependencies"]["@types/node"] = "20.2.5";
	// 	frontEndPackageJson["dependencies"]["@types/react"] = "18.2.9";
	// 	frontEndPackageJson["dependencies"]["@types/react-dom"] = "18.2.4";
	// }
	// if (useBackend) {
	// 	fs.writeFileSync(
	// 		path.join("frontend", "package.json"),
	// 		JSON.stringify(frontEndPackageJson, null, "\t")
	// 	);
	// } else {
	// 	fs.writeFileSync(
	// 		"package.json",
	// 		JSON.stringify(frontEndPackageJson, null, "\t")
	// 	);
	// }

	if (useBackend) {
		const backendPackageJson = JSON.parse(
			JSON.stringify(packageJsonTemplate)
		);
		switch (backendProvider) {
			case "hardhat-template":
			case "hardhat":
				backendPackageJson["devDependencies"][
					"@nomicfoundation/hardhat-toolbox"
				] = "^1.0.2";
				backendPackageJson["devDependencies"]["hardhat"] = "^2.10.1";
				backendPackageJson["dependencies"]["dotenv"] = "^16.0.2";
				backendPackageJson["scripts"]["build"] = "npx hardhat compile";
				if (hasSmartContract)
					backendPackageJson["scripts"][
						"deploy-testnet"
					] = `npx hardhat run ./scripts/${
						hasSmartContract
							? `${contractName}_deploy.js`
							: "deploy.js"
					} --network ${testnet}`;
				backendPackageJson["scripts"][
					"deploy"
				] = `npx hardhat run ./scripts/${
					hasSmartContract ? `${contractName}_deploy.js` : "deploy.js"
				} --network ${chain}`;
				backendPackageJson["scripts"]["node"] = `npx hardhat node`;
				backendPackageJson["scripts"][
					"deploy-local"
				] = `npx hardhat run ./scripts/${
					hasSmartContract ? `${contractName}_deploy.js` : "deploy.js"
				} --network localhost`;

				break;
			case "foundry":
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
	}
};
