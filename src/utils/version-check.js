import chalk from "chalk";

export function checkNodeVersion() {
	const currentVersion = process.versions.node;
	const majorVersion = parseInt(currentVersion.split(".")[0]);

	if (majorVersion < 22) {
		console.log(chalk.yellow("⚠️  WARNING  ⚠️"));
		console.log(chalk.yellow("═══════════════"));
		console.log(
			chalk.yellow(
				`You are using Node.js v${currentVersion}. The deployment scripts require Node.js v22 or higher.`
			)
		);
		console.log(
			chalk.yellow(
				"While your project has been set up successfully, you will need to upgrade Node.js before running deployment scripts."
			)
		);
		console.log(
			chalk.yellow(
				"\nTo upgrade Node.js, visit: https://nodejs.org/en/download"
			)
		);
		console.log(
			chalk.yellow(
				"\nAlternatively, we recommend using version managers like 'n' or 'nvm' to manage Node.js versions:"
			)
		);
		console.log(
			chalk.yellow(
				"• n: npm install -g n        (https://www.npmjs.com/package/n)"
			)
		);
	}
}
