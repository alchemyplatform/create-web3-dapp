import { execSync } from "child_process";
import prompts from "prompts";

export const checkNewPackageUpdates = async () => {
	try {
		// success command
		console.log("Checking for new updates...");
		const command = "npm outdated --location=global";
		const output = execSync(command);
	} catch (error: any) {
		// console.log(error.stdout.toString())
		if (error.stdout.toString().includes("create-web3-dapp")) {
			const wantsToUpdate: boolean | string = await prompts({
				type: "select",
				name: "wantsToUpdate",
				message:
					"A new version of create-web3-dapp has been found, do you want to update?",
				choices: [
					{
						title: "Yes",
						value: true,
					},
					{ title: "No", value: false },
				],
				initial: 0,
				hint: "- You can change it later",
			}).then((data) => data.wantsToUpdate);
			if (wantsToUpdate) {
				const password: boolean | string = await prompts({
					type: "password",
					name: "password",
					message: "Password",
				}).then((data) => data.password);
				if (password) {
					try {
						const command = `echo ${password}| sudo -S npm install npm@latest -g create-web3-dapp`;
						execSync(command);
					} catch (error: any) {
						console.log(error);
					}
				}
			}
		} else {
			return;
		}
	}
};
