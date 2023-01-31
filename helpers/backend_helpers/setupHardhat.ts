import path from "path";
import { createEnv } from "../utils/createEnv.js";
import fse from "fs-extra";
import { DappInfo } from "../../interfaces/DappInfo.js";
import { createWriteStream } from "fs";
import { generateAlchemyURL } from "../utils/generateAlchemyUrl.js";

export const setUpHardhat = (dappInfo: DappInfo, projectPath) => {


	const hardhatTemplate = path.join(projectPath, "templates", "hardhat");
	fse.mkdirSync(path.join(projectPath, "backend"));
	fse.copySync(hardhatTemplate, path.join(projectPath, "backend"));

	createEnv(
		{ ...dappInfo.apiKeys, ETHERSCAN_API_KEY: "", PRIVATE_KEY: "" },
		path.join(projectPath, "backend")
	);

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
