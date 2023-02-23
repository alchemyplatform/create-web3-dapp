#!/usr/bin/env node

import { selfDestroy } from "./helpers/core/selfDestroy.js";
import chalk from "chalk";
import open from "open";
import { smartContractWizard } from "./helpers/smartContractsWizard/smartContractWizard.js";
import { buildSmartContract } from "./helpers/smartContractsWizard/smartContractBuilder.js";
import { startStandardWorkflow } from "./helpers/core/workflows/standardWorkflow.js";
import { startTemplatesWorkflow } from "./helpers/core/workflows/templatesWorkflow.js";
import context from "./helpers/core/context.js";
import { checkNewPackageUpdates } from "./helpers/utils/checkNewPackageUpdates.js";

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
console.log(
	"Welcome to the create-web3-dapp wizard 🔮"
);

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
	switch (process.argv[2]) {
		case "marketplace":
			try {
				open("https://createweb3dapp.com");
			} catch (e) {
				selfDestroy(e);
			}
			break;
		case "backpack":
			startSmartContractFlow();
			break;
		case "nft-explorer":
			context.dappInfo.template = 0;
			startTemplatesWorkflow(false);
			break;
		case "creator-dapp":
			context.dappInfo.template = 1;
			startTemplatesWorkflow(true);
			break;
		default:
			console.log("\n");
			startStandardWorkflow();
			break;
	}
}

main();
