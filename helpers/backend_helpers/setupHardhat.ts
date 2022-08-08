import chalk from "chalk";
import cliProgress from "cli-progress";
import path from "path";
import { createEnv } from "../utils/createEnv.js";
import fse from "fs-extra";
import { dappInfo } from "../../interfaces/dappInfo.js";
import { createWriteStream } from "fs";
import { generateAlchemyURL } from "../utils/generateAlchemyUrl.js";

export const setUpHardhat = (dappInfo: dappInfo) => {
	const bar2 = new cliProgress.SingleBar(
		{},
		cliProgress.Presets.shades_classic
	);
	bar2.start(100, 0);
	bar2.update(50);

	const hardhatTemplate = path.join(process.cwd(), "templates", "hardhat");
	fse.mkdirSync(path.join(process.cwd(), "backend"));
	fse.copySync(hardhatTemplate, path.join(process.cwd(), "backend"));

	if (dappInfo.apiKeys) {
		createEnv(dappInfo.apiKeys, path.join(process.cwd(), "backend"), false);
	}

	const writeStream = createWriteStream(
		path.join(process.cwd(), "backend", "hardhat.config.js")
	);

	writeStream.write("require('@nomicfoundation/hardhat-toolbox');\n");
	writeStream.write("require('dotenv').config()\n");

	writeStream.write("// Remove the quotes to get started \n");
	const modules = {
		solidity: "0.8.9",
		networks: {
			hardhat: {},
			[dappInfo.chain]: {
				accounts: "[`0x${process.env.PRIVATE_KEY}`]",
				url: generateAlchemyURL(
					dappInfo.chain,
					dappInfo.apiKeys.alchemy_api_key
				),
			},
		},
	};

	if (dappInfo.isTestnet) {
		modules.networks[dappInfo.testnet!] = {
			accounts: "[`0x${process.env.PRIVATE_KEY}`]",
			url: generateAlchemyURL(
				dappInfo.testnet,
				dappInfo.apiKeys.alchemy_api_key
			),
		};
	}

	writeStream.write(
		`module.exports = ${JSON.stringify(modules, null, "\t").replace(
			/"([^"]+)":/g,
			"$1:"
		)}`
	);
	writeStream.close();

	bar2.update(100);
	bar2.stop();
	console.log(
		chalk.green("Smart Contract Development Environment copied ✅")
	);
};
