#!/usr/bin/env node

import chalk from "chalk";
import { smartContractWizard } from "./helpers/smartContractsWizard/smartContractWizard.js";
import { buildSmartContract } from "./helpers/smartContractsWizard/smartContractBuilder.js";
import { startStandardWorkflow } from "./helpers/core/workflows/standardWorkflow.js";
import { parseCommandOptions } from "./helpers/utils/parseCommandOptions.js";
import { checkNewPackageUpdates } from "./helpers/utils/checkNewPackageUpdates.js";
import { Command } from "commander";
import { setVerbosity } from "./helpers/core/selfDestroy.js";

const program = new Command();
program
	.name("")
	.description("")
	.version("aasd")
	.option("-n, --name [value]", "specify a name for your application")
	.option(
		"-t, --template [value]",
		"specify a template to start your application from"
	)
	.option(
		"-ts, --use-typescript [value]",
		"Kickstart your dapp using typescript"
	)
	.option(
		"-c, --chain [value]",
		"select the chain on which your application will run"
	)
	.option(
		"-b, --bde [value]",
		"select the blockchain development environment to integrate"
	)
	.option(
		"-k, --api-key [value]",
		"specify an Alchemy API Key to power your application"
	)
	.option("-v, --verbose", "sdd error level logging verbosity")
	.option(
		"-cs, --contract-standard [value]",
		"specify a smart contract standard to use"
	)
	.option(
		"-cn, --contract-name [value]",
		"specify a name for your smart contract"
	)
	.parse(process.argv);

console.log(
	chalk.blue(`
           «╠
          '▒░▒╓                  ╗           ╔ε
         ╬  ╬▒▒╦          ,,     ╬     ,,    ╠Γ ,,       ,,       ,,   ,,
       ╓╬╬╬  ╠╬╬▒       ª╩  "╬   ╬  ,╬╜  ╙▒  ╠╬╙ '╙▒   ╬╜  ╙▒  ╚╠╙ '╬▒╜ '╠▒  ╬    ╬╜
      φ╬╬╠              ,╔#δδ╠Γ  ╬  ╠Γ       ╠Γ    ╠⌐ ╠╬####╝⌐ ╚╠   ╞╬   ]╬   ╬  ╬╜
     ╬╬╬╬ ╔╬╬╬╬╬╬╬╬╦    ╬   ╓╠Γ  ╬  ╘╬,  ,▒  ╠Γ    ╠⌐ └╬,  ,╗  ╚╠   ╞╬   ]╬    ╬╬╙
    ''''  ''''''''''     "╙' '   '    '""    '     '    '""'   ''    '    '    ╬╙
                                  create-web3-dapp                            ╝' 
`)
);
console.log("Welcome to the create-web3-dapp wizard 🔮");

const startSmartContractFlow = async () => {
	const currentPath = process.cwd().split("/");
	const currentDirectory = currentPath[currentPath.length - 1];
	if (currentDirectory !== "backend") {
		console.log(
			"ERROR: Make sure to be in a create-web3-dapp 'backend' directory before starting the smart contracts backback"
		);
		console.log(
			"TIP: If you haven't already, run npx create-web3-dapp@latest to get started"
		);
		return;
	}
	const contractInfo = await smartContractWizard();
	if (contractInfo) buildSmartContract(contractInfo, process.cwd());
};

async function main() {
	checkNewPackageUpdates();
	setVerbosity(program.opts().verbose);
	const options = {
		projectPath: program.opts().name,
		builderTemplate: program.opts().template,
		chain: program.opts().chain,
		isTypescript: program.opts().useTypescript,
		backend: program.opts().backend,
		contractStandard: program.opts()["contract-standard"],
		contractName: program.opts()["contract-name"],
		apiKey: program.opts().apiKey,
	};
	parseCommandOptions(options);

	startStandardWorkflow();
}

main();
