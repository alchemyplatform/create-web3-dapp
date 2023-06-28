import { execSync } from "child_process";
import prompts from "prompts";

export const checkNewPackageUpdates = async () => {
	try {
		// success command
		console.log("\n⏳ Checking for new updates...");
		const command = "npm outdated --location=global";
		const output = execSync(command);
	} catch (error: any) {
		// console.log(error.stdout.toString())	
		if (error.stdout.toString().includes("create-web3-dapp")) {
			console.log(
				"\nThe version of create-web3-dapp installed is outdated.\nRun npx create-web3-dapp@latest to always use the latest version. Ignore this message if already used.\n"
			);
		}
	}
};
