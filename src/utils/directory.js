import fs from "fs";
import path from "path";
import chalk from "chalk";
import clone from "git-clone/promise.js";
import { CHAIN_CONFIGS } from "../config/chains.js";

export async function setupProjectDirectory(projectName, chain, inquirer) {
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

		const chainConfig = CHAIN_CONFIGS.find((c) => c.id === chain);

		await clone(
			"https://github.com/alchemyplatform/scaffold-alchemy",
			projectDir,
			{ shallow: true }
		);

		fs.rmSync(path.join(projectDir, ".git"), {
			recursive: true,
			force: true,
		});

		const hardhatConfigPath = path.join(
			projectDir,
			"packages/hardhat/hardhat.config.ts"
		);
		if (fs.existsSync(hardhatConfigPath)) {
			let hardhatConfig = fs.readFileSync(hardhatConfigPath, "utf8");
			hardhatConfig = hardhatConfig.replace(
				/defaultNetwork:\s*["'].*["']/,
				`defaultNetwork: "${chainConfig.scaffoldConfigId}"`
			);
			fs.writeFileSync(hardhatConfigPath, hardhatConfig);
		}

		const nextjsScaffoldConfigPath = path.join(
			projectDir,
			"packages/nextjs/scaffold.config.ts"
		);
		if (fs.existsSync(nextjsScaffoldConfigPath)) {
			let nextjsConfig = fs.readFileSync(
				nextjsScaffoldConfigPath,
				"utf8"
			);
			nextjsConfig = nextjsConfig.replace(
				/targetNetworks:\s*\[chains\.[^\]]+\]/,
				`targetNetworks: [chains.${chainConfig.scaffoldConfigId}]`
			);
			fs.writeFileSync(nextjsScaffoldConfigPath, nextjsConfig);
		}
	} catch (error) {
		console.error(chalk.red("\nFailed to clone template:"), error);
		process.exit(1);
	}

	return { projectDir, currentDir };
}
