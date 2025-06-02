import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import chalk from "chalk";
import inquirer from "inquirer";

/**
 * Loads chain options from the configuration file
 * @param {string} projectDir - The project directory
 * @returns {string[]} Array of valid chain short names
 */
function loadChainOptions(projectDir) {
	try {
		const chainOptionsPath = path.join(
			projectDir,
			"common",
			"chainOptions.json"
		);
		const chainOptions = JSON.parse(
			fs.readFileSync(chainOptionsPath, "utf8")
		);
		return chainOptions;
	} catch (error) {
		console.error(chalk.red("\nError reading chain options:"), error);
		process.exit(1);
	}
}

/**
 * Gets the chain from command line options or prompts the user
 * @param {Object} options - Command line options
 * @param {Array<Object>} validChains - Array of chain objects
 * @returns {Promise<Object>} Selected chain object
 */
async function getChainFromOptions(options, validChains) {
	if (options.chain) {
		const selectedChain = validChains.find(
			(chain) => chain.shortName === options.chain
		);
		if (!selectedChain) {
			console.error(
				chalk.red(
					`Error: Invalid chain "${
						options.chain
					}". Valid chains are: ${validChains
						.map((c) => c.shortName)
						.join(", ")}`
				)
			);
			process.exit(1);
		}
		return selectedChain;
	}

	const { chainDisplayName } = await inquirer.prompt([
		{
			type: "list",
			name: "chainDisplayName",
			message: "Select a chain:",
			choices: validChains.map((chain) => chain.displayName),
		},
	]);

	const selectedChain = validChains.find(
		(chain) => chain.displayName === chainDisplayName
	);
	return selectedChain;
}

/**
 * Sets up the chain configuration for the project
 * @param {string} projectDir - The project directory
 * @param {Object} options - Command line options
 */
export async function setupChain(projectDir, options) {
	const validChains = loadChainOptions(projectDir);
	const selectedChain = await getChainFromOptions(options, validChains);

	try {
		console.log(chalk.cyan("\nSetting up chain configuration..."));
		execSync(
			`node ./common/script/chain.js -c ${selectedChain.shortName}`,
			{
				cwd: projectDir,
				stdio: "inherit",
			}
		);
	} catch (error) {
		console.error(chalk.red("\nError setting up chain:"), error);
		process.exit(1);
	}
}
