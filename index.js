#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import { Command } from "commander";
import { setupProjectDirectory } from "./src/utils/setup-project.js";
import { setupChain } from "./src/utils/setup-chain.js";
import { logo } from "./src/utils/ascii-art.js";
import { projectNamePrompt } from "./src/prompts/project-prompts.js";
import { printOutroMessage } from "./src/utils/outro.js";
import { checkNodeVersion } from "./src/utils/version-check.js";

const program = new Command();

program
	.option("-c, --chain <chain>", "specify the chain to use")
	.parse(process.argv);

const options = program.opts();

async function handleNewProject() {
	console.log(chalk.blue(logo));

	const { projectName } = await inquirer.prompt([projectNamePrompt]);

	const { projectDir } = await setupProjectDirectory(projectName, inquirer);

	await setupChain(projectDir, options);

	await printOutroMessage(projectName);
}

async function main() {
	await handleNewProject();
	checkNodeVersion();
}

main().catch((error) => {
	console.error(chalk.red("Error:"), error);
	process.exit(1);
});
