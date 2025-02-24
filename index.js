#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import { Command } from "commander";
import { setupProjectDirectory } from "./src/utils/directory.js";
import { logo } from "./src/utils/ascii-art.js";
import {
	projectNamePrompt,
	chainPrompt,
	VALID_CHAINS,
} from "./src/prompts/project-prompts.js";
import { printOutroMessage } from "./src/utils/outro.js";
import { checkNodeVersion } from "./src/utils/version-check.js";

console.log(chalk.blue(logo));

const program = new Command();

program
	.option("-c, --chain <chain>", "specify the chain to use")
	.parse(process.argv);

const options = program.opts();

async function main() {
	// Validate chain if provided via command line
	if (options.chain && !VALID_CHAINS.includes(options.chain)) {
		console.error(
			chalk.red(
				`Error: Invalid chain "${
					options.chain
				}". Valid chains are: ${VALID_CHAINS.join(", ")}`
			)
		);
		process.exit(1);
	}

	const nameAnswer = await inquirer.prompt([projectNamePrompt]);
	const { projectName } = nameAnswer;

	let chain = options.chain;
	if (!chain) {
		const chainAnswer = await inquirer.prompt([chainPrompt]);
		chain = chainAnswer.chain;
	}

	const { projectDir } = await setupProjectDirectory(
		projectName,
		chain,
		inquirer
	);

	console.log(
		chalk.green(
			`\nCreating a new web3 dapp in ${chalk.bold(
				projectDir
			)} using ${chalk.bold(chain)} chain...\n`
		)
	);

	await printOutroMessage(projectName);

	checkNodeVersion();
}

main().catch((error) => {
	console.error(chalk.red("Error:"), error);
	process.exit(1);
});
