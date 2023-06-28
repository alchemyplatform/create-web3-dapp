import { execSync, spawn } from "child_process";
import { LogLevel, selfDestroy } from "./selfDestroy.js";
import path from "path";
import { generatePackageDotJson } from "../utils/generatePackageDotJson.js";
import { BuilderContext } from "../../interfaces/BuilderContext";
import { logInstructions } from "./logInstructions.js";
import cli from "cli-progress";
let index = 0;
let progress = 0;
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
const bar = new cli.SingleBar(
	{
		format:
			"Installing dependencies |" +
			"{bar}" +
			"| {percentage}% || {filename}",
	},
	cli.Presets.shades_classic
);
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
			isTemplate,
		} = dappInfo;
		if (!isTemplate) {
			generatePackageDotJson(
				projectName,
				isEVM,
				testnet,
				useBackend,
				backendProvider,
				hasSmartContract,
				chain,
				contractInfo?.name
			);
		}

		if (useBackend && resolvedProjectPath) {
			process.chdir(path.join(resolvedProjectPath, "frontend"));
		}

		execSync("npx npm-check-updates  --silent");
		const npmInstall = spawn(
			process.platform === "win32" ? "npm.cmd" : "npm",
			["install", "--color", "--no-audit", "--progress", "--verbose"]
		);

		bar.start(useBackend ? 8000 : 3500, 0);
		npmInstall.stderr.on("data", (data) => {
			bar.update(progress, {
				filename: sentences[index],
			});
			const random = Math.floor(Math.random() * 250) + 30;
			if (progress % random == 0) {
				index += 1;
			}
			progress += 2;
		});

		npmInstall.on("close", (code) => {
			if (useBackend) {
				installBackendDependencies(dappInfo, resolvedProjectPath);
			} else {
				bar.update(3500, {
					filename: "Finalised",
				});
				bar.stop();
				logInstructions(dappInfo);
			}
		});
		if (resolvedProjectPath) process.chdir(resolvedProjectPath);
	} catch (e) {
		selfDestroy(e, LogLevel.ERROR);
	}
};

const installBackendDependencies = (dappInfo, resolvedProjectPath) => {
	process.chdir(path.join(resolvedProjectPath, "backend"));
	execSync("npx npm-check-updates --silent");
	const npmInstall = spawn(process.platform === "win32" ? "npm.cmd" : "npm", [
		"install",
		"--color",
		"--no-audit",
		"--progress",
		"--verbose",
	]);

	npmInstall.stderr.on("data", (data) => {
		bar.update(progress, {
			filename: sentences[index],
		});
		const random = Math.floor(Math.random() * 250) + 30;
		if (progress % random == 0) {
			index += 1;
		}
		progress += 2;
	});

	npmInstall.on("close", (code) => {
		bar.update(8000, {
			filename: "Finalised",
		});
		bar.stop();
		console.log("\n");
		logInstructions(dappInfo);
	});
};
