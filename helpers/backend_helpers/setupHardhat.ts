import path from "path";
import { createEnv } from "../utils/createEnv.js";
import fse from "fs-extra";
import { DappInfo } from "../../interfaces/DappInfo.js";
import { createWriteStream, mkdirSync } from "fs";
import { generateAlchemyURL } from "../utils/generateAlchemyUrl.js";
import { execSync } from "child_process";

export const setUpHardhat = (dappInfo: DappInfo, projectPath) => {
	mkdirSync(path.join(process.cwd(), "backend"));
	mkdirSync(path.join(process.cwd(), "backend", "contracts"));
	mkdirSync(path.join(process.cwd(), "backend", "scripts"));
	mkdirSync(path.join(process.cwd(), "backend", "test"));
	

	const writeStream = createWriteStream(
		path.join(projectPath, "backend", "hardhat.config.js")
	);

	writeStream.write("require('@nomicfoundation/hardhat-toolbox');\n");
	writeStream.write("require('dotenv').config()\n\n");

	const modules = {
		solidity: "0.8.9",
		networks: {
			hardhat: {},
			[dappInfo.chain]: {
				accounts: "[`${process.env.PRIVATE_KEY}`]",
				url: generateAlchemyURL(dappInfo.chain),
			},
		},
		etherscan: {
			apiKey: "`${process.env.ETHERSCAN_API_KEY}`",
		},
	};

	if (dappInfo.isTestnet && dappInfo.testnet) {
		modules.networks[dappInfo.testnet] = {
			accounts: "[`${process.env.PRIVATE_KEY}`]",
			url: generateAlchemyURL(dappInfo.testnet),
		};
	}

	writeStream.write(
		`module.exports = ${JSON.stringify(modules, null, "\t").replace(
			/"(?!\d\.\d\.\d)([^",]+)"/g,
			"$1"
		)}`
	);
	writeStream.close();
};
