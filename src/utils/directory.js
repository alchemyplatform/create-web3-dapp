import fs from "fs";
import path from "path";
import chalk from "chalk";
import clone from "git-clone/promise.js";
import { CHAIN_CONFIGS } from "../config/chains.js";
import { fileURLToPath } from "url";

// Get directory name in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

		const chainConfig = CHAIN_CONFIGS.find((c) => c.mainnetName === chain);

		await clone(
			"https://github.com/alchemyplatform/scaffold-alchemy",
			projectDir,
			{ shallow: true }
		);

		fs.rmSync(path.join(projectDir, ".git"), {
			recursive: true,
			force: true,
		});

		const templatePath = path.join(
			__dirname,
			"../templates/cw3d.config.template"
		);
		const template = fs.readFileSync(templatePath, "utf8");

		const configContent = template
			.replace("{{mainnetName}}", chainConfig.mainnetName)
			.replace("{{mainnetChainId}}", chainConfig.mainnetChainId)
			.replace("{{testnetChainId}}", chainConfig.testnetChainId)
			.replace("{{testnetChainName}}", chainConfig.testnetChainName);

		const hardhatConfigPath = path.join(
			projectDir,
			"packages/hardhat/cw3d.config.ts"
		);
		fs.writeFileSync(hardhatConfigPath, configContent);

		const nextjsConfigPath = path.join(
			projectDir,
			"packages/nextjs/cw3d.config.ts"
		);
		fs.writeFileSync(nextjsConfigPath, configContent);
	} catch (error) {
		console.error(chalk.red("\nFailed to clone template:"), error);
		process.exit(1);
	}

	return { projectDir, currentDir };
}
