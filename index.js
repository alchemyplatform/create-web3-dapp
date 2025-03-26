#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import { Command } from "commander";
import {
	setupProjectDirectory,
	isInsideScaffoldAlchemyProject,
	updateProjectConfig,
} from "./src/utils/directory.js";
import { logo } from "./src/utils/ascii-art.js";
import {
	projectNamePrompt,
	chainPrompt,
	VALID_CHAINS,
} from "./src/prompts/project-prompts.js";
import { printOutroMessage } from "./src/utils/outro.js";
import { checkNodeVersion } from "./src/utils/version-check.js";

const program = new Command();

program
	.option("-c, --chain <chain>", "specify the chain to use")
	.parse(process.argv);

const options = program.opts();

async function getChain() {
	let chain = getChainOption();
	if (!chain) {
		const chainAnswer = await inquirer.prompt([chainPrompt]);
		chain = chainAnswer.chain;
	}
	return chain;
}

function getChainOption() {
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

	return options.chain;
}

async function handleExistingProject() {
	const chain = await getChain();
	console.log(
		chalk.green(
			`\nUpdating chain configuration to ${chalk.bold(chain)}...\n`
		)
	);
	updateProjectConfig(chain);
	console.log(chalk.green("Chain configuration updated successfully!"));
}

async function handleNewProject() {
	console.log(chalk.blue(logo));

	const { projectName } = await inquirer.prompt([projectNamePrompt]);

	const chain = await getChain();

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
}

async function main() {
	if (isInsideScaffoldAlchemyProject()) {
		await handleExistingProject();
	} else {
		await handleNewProject();
	}

	checkNodeVersion();
}

main().catch((error) => {
	console.error(chalk.red("Error:"), error);
	process.exit(1);
});
