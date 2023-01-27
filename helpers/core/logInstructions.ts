import chalk from "chalk";
import { DappInfo } from "../../interfaces/DappInfo";

export const logInstructions = (dappInfo: DappInfo, projectPath: string) => {
	console.log("\n\n\n");
	console.log("⚡️ Quick start:");
	let step = 1;

	console.log(
		`${step}. Visit the docs: ${chalk.blue(
			`https://docs.alchemy.com/?a=create-web3-dapp`
		)}`
	);
	step++;
	console.log(
		`${step}. Modify your code by opening it in your favorite code editor. `
	);
	step++;
	if (dappInfo.useBackend) {
		console.log(
			`${step}. Add your private key in the .env file inside the backend folder`
		);
		step++;
	}

	console.log(
		`${step}. 'To start it, run: ${chalk.green(
			`cd ${
				dappInfo.useBackend
					? `${projectPath}/frontend`
					: `${projectPath}`
			} && npm run dev`
		)}`
	);
};
