#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import { setupProjectDirectory } from "./src/utils/directory.js";
import { logo } from "./src/utils/ascii-art.js";
import { projectNamePrompt } from "./src/prompts/project-prompts.js";
import { printOutroMessage } from "./src/utils/outro.js";

console.log(chalk.blue(logo));

async function main() {
	const answers = await inquirer.prompt([projectNamePrompt]);

	const { projectName } = answers;

	const { projectDir } = await setupProjectDirectory(projectName, inquirer);

	console.log(
		chalk.green(
			`\nCreating a new web3 dapp in ${chalk.bold(projectDir)}...\n`
		)
	);

	printOutroMessage(projectName);
}

main().catch((error) => {
	console.error(chalk.red("Error:"), error);
	process.exit(1);
});
