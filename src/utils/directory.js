import fs from "fs";
import path from "path";
import chalk from "chalk";
import clone from "git-clone/promise.js";

export async function setupProjectDirectory(projectName, inquirer) {
	const currentDir = process.cwd();
	const projectDir = path.join(currentDir, projectName);

	if (fs.existsSync(projectDir)) {
		const { overwrite } = await inquirer.prompt([
			{
				type: "confirm",
				name: "overwrite",
				message: `Directory ${projectName} already exists. Do you want to overwrite it?`,
				default: false,
			},
		]);

		if (!overwrite) {
			console.log(chalk.red("Operation cancelled"));
			process.exit(1);
		}

		fs.rmSync(projectDir, { recursive: true, force: true });
	}

	fs.mkdirSync(projectDir, { recursive: true });

	try {
		console.log(chalk.cyan("\nCloning scaffold-alchemy template..."));
		await clone(
			"https://github.com/alchemyplatform/scaffold-alchemy",
			projectDir,
			{ shallow: true }
		);

		// Remove .git folder to start fresh
		fs.rmSync(path.join(projectDir, ".git"), {
			recursive: true,
			force: true,
		});
	} catch (error) {
		console.error(chalk.red("\nFailed to clone template:"), error);
		process.exit(1);
	}

	return { projectDir, currentDir };
}
