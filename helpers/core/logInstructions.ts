import chalk from "chalk";
import { DappInfo } from "../../interfaces/DappInfo";
import context from "./context.js";

export const logInstructions = (dappInfo: DappInfo) => {
	let step = 1;

	if (dappInfo.useBackend) {
		console.log(
			`${step}. Add your private key in the .env file inside the backend folder`
		);
		step++;
	}

	console.log(
		`${step}. To start the application, run: ${chalk.green(
			`cd ${
				dappInfo.useBackend
					? `${context.projectName}/frontend`
					: `${context.projectName}`
			} && npm run dev`
		)}`
	);

	process.exit(0)
};
