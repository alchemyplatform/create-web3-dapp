import { execSync, spawn } from "child_process";
import { selfDestroy } from "./selfDestroy.js";
import path from "path";
import { generatePackageDotJson } from "../utils/generatePackageDotJson.js";
import { BuilderContext } from "../../interfaces/BuilderContext";
import { logInstructions } from "./logInstructions.js";
import cli from "cli-progress";

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
			"--verbose",
		]);
		const bar1 = new cli.SingleBar(
			{
				format:
					"Frontend dependencies |" +
					"{bar}" +
					"| {percentage}% || {filename}",
			},
			cli.Presets.shades_classic
		);
		bar1.start(3500, 0);

		let frontendDependenciesProgress = 0;
		const sentences = [
			"Initializing the environment",
			"Setting up your Next project",
			"Configuring the settings",
			"Preparing the workbench",
			"Building the foundation",
			"Installing wagmi hooks",
			"Installing Alchemy SDK",
			"Installing Rainbow kit",
			"Creating your environment files",
			"Adding your API Keys",
			"Now we install the dependencies",
			"Digging the trench",
			"Setting up OpenZeppelin",
			"Optimizing the user experience",
			"Learn web3 for free at university.alchemy.com",
			"Scaling the infrastructure",
			"Monitoring the system",
			"Updating the dependencies",
			"Analyzing the data",
			"Join discord on alchemy.com/discord",
			"Creating the documentation",
			"Follow us on Twitter @alchemyplatform",
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

		npmInstall.stderr.on("data", (data) => {
			bar1.update(frontendDependenciesProgress, {
				filename: sentences[index],
			});
			const random = Math.floor(Math.random() * 250) + 30;
			if (frontendDependenciesProgress % random == 0) {
				index += 1;
			}
			frontendDependenciesProgress += 2;
		});

		npmInstall.on("close", (code) => {
			bar1.update(3500, {
				filename: "Finalised",
			});
			bar1.stop();
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
		"--verbose",
	]);
	const bar2 = new cli.SingleBar(
		{
			format:
				"Backend dependencies |" +
				"{bar}" +
				"| {percentage}% || {filename}  ",
		},
		cli.Presets.shades_classic
	);
	bar2.start(4500, 0);

	let backendDependenciesProgress = 0;

	const sentences = [
		"Mining the blocks",
		"Creating your smart contract",
		"Synchronizing with the chain",
		"Validating the smart contracts",
		"Configuring the RPC",
		"Encrypting the data",
		"Hashing the blocks",
		"Broadcasting the messages",
		"Installing Rainbowkit",
		"Generating the keys",
		"Assembling the parts",
		"Polishing the surface",
		"Adding the finishing touches",
		"Double-checking the details",
		"Creating the env file",
		"Setting up your Alchemy API Key",
		"Installing",
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

	npmInstall.stderr.on("data", (data) => {
		bar2.update(backendDependenciesProgress, {
			filename: sentences[index],
		});
		const random = Math.floor(Math.random() * 250) + 30;
		if (backendDependenciesProgress % random == 0) {
			index += 1;
		}
		backendDependenciesProgress += 2;
	});

	npmInstall.on("close", (code) => {
		bar2.update(4500, {
			filename: "Finalised",
		});
		bar2.stop();
		console.log("\n")
		logInstructions(dappInfo);
	});
};
