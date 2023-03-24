import { execSync, spawn } from "child_process";
import { selfDestroy } from "./selfDestroy.js";
import path from "path";
import { generatePackageDotJson } from "../utils/generatePackageDotJson.js";
import { BuilderContext } from "../../interfaces/BuilderContext";
import { logInstructions } from "./logInstructions.js";
import ora from "ora";
export const installDependencies = async ({
	dappInfo,
	contractInfo,
	projectName,
	resolvedProjectPath,
}: BuilderContext) => {
	try {
		const {
			chain,
			testnet,
			isEVM,
			useBackend,
			backendProvider,
			hasSmartContract,
			isTestnet,
		} = dappInfo;

		generatePackageDotJson(
			projectName,
			isEVM,
			isTestnet,
			testnet,
			useBackend,
			backendProvider,
			hasSmartContract,
			chain,
			contractInfo?.name
		);

		if (useBackend) {
			process.chdir(path.join(resolvedProjectPath, "frontend"));
		}

		execSync("npx npm-check-updates  --silent");
		const npmInstall = spawn("npm", [
			"install",
			"--color",
			"--no-audit",
			"--progress",
		]);
		const spinner = ora("Installing frontend dependencies").start();

		const sentences = [
			"Initializing the environment",
			"Cloning the repository",
			"Configuring the settings",
			"Preparing the workbench",
			"Building the foundation",
			"Pouring the concrete",
			"Laying the bricks",
			"Cutting the wood",
			"Measuring twice, cutting once",
			"Checking the blueprints",
			"Digging the trench",
			"Deploying the application",
			"Scaling the infrastructure",
			"Monitoring the system",
			"Securing the network",
			"Updating the dependencies",
			"Analyzing the data",
			"Designing the user interface",
			"Optimizing the user experience",
			"Creating the documentation",
			"Collaborating with the team",
			"Reviewing the code",
			"Migrating the data",
			"Backing up the files",
			"Almost there",
			"Hold on",
			"Finalising the latest snippets",
			"Checking for dependencies updates",
			"A few more MBs",
			"We're getting there",
			"It's almost ready",
			"Here we go",
		];
		let index = 0;
		setInterval(() => {
			spinner.text = sentences[index];
			index += 1;
		}, Math.floor(Math.random() * 7000) + 3000);
		npmInstall.stderr.on("data", (data) => {});

		npmInstall.on("close", (code) => {
			spinner.text = "Installation complete!";
			spinner.stop();
			if (useBackend) {
				installBackendDependencies(dappInfo, resolvedProjectPath);
			} else {
				logInstructions(dappInfo);
			}
		});

		process.chdir(resolvedProjectPath);
	} catch (e) {
		selfDestroy(e);
	}
};

const installBackendDependencies = (dappInfo, resolvedProjectPath) => {
	process.chdir(path.join(resolvedProjectPath, "backend"));
	execSync("npx npm-check-updates ");
	const npmInstall = spawn("npm", [
		"install",
		"--color",
		"--no-audit",
		"--progress",
	]);
	const spinner = ora("Installing backend dependencies").start();
	const sentences = [
		"Mining the blocks",
		"Verifying the transactions",
		"Synchronizing with the chain",
		"Validating the smart contracts",
		"Configuring the nodes",
		"Encrypting the data",
		"Hashing the blocks",
		"Signing the transactions",
		"Broadcasting the messages",
		"Consensus achieved",
		"Generating the keys",
		"Assembling the parts",
		"Testing the circuits",
		"Polishing the surface",
		"Adding the finishing touches",
		"Double-checking the details",
		"Aligning the elements",
		"Inspecting the work",
		"Cleaning the workspace",
		"Removing the debris",
		"Almost there",
		"Hold on",
		"Finalising the latest snippets",
		"Installation complete!",
		"Checking for dependencies updates",
		"A few more MBs",
		"We're getting there",
		"It's almost ready",
		"Here we go",
	];
	let index = 0;
	setInterval(() => {
		spinner.text = sentences[index];
		index += 1;
	}, Math.floor(Math.random() * 7500) + 3000);
	npmInstall.stderr.on("data", (data) => {
		// console.log("backend",data.toString());
	});

	npmInstall.on("close", (code) => {
		spinner.stop();
		spinner.text = "Installation complete!";
		logInstructions(dappInfo);
	});
};
