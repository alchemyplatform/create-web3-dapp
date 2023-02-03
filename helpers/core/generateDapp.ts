import path from "path";
import { installDependencies } from "./dependenciesInstaller.js";
import { mkdir } from "../utils/mkdir.js";
import { getProjectFiles } from "./getProjectFiles.js";
import { logInstructions } from "./logInstructions.js";
import context from "./context.js";
import { selfDestroy } from "./selfDestroy.js";

import { buildSmartContract } from "../smartContractsWizard/smartContractBuilder.js";
export const generateDapp = async (projectPath: string) => {
	try {
		const steps = context.dappInfo.hasSmartContract ? 4 : 3;
		let currentStep = 1;
		console.log(`[0/${steps}] 🚀 Creating your dapp boilerplates`);
		console.log(`[${currentStep}/${steps}] 🗂 Setting up the directory...`);
		mkdir(context.resolvedProjectPath);
		currentStep++;
		console.log(`[${currentStep}/${steps}] 💾 Dowloading project files...`);
		getProjectFiles(context);
		currentStep++;

		if (context.dappInfo.hasSmartContract && context.contractInfo) {
			console.log(
				`[${currentStep}/${steps}] 📄 Creating the smart contract`
			);
			currentStep++;

			buildSmartContract(
				context.contractInfo,
				path.join(process.cwd(), "backend")
			);
		}

		console.log(
			`[${currentStep}/${steps}] 🔧 Installing the dependencies - this might take a while`
		);
		currentStep++;
		await installDependencies(context);

		logInstructions(context.dappInfo, projectPath);
	} catch (e) {
		selfDestroy(e);
	}
};
