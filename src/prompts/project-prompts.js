export const projectNamePrompt = {
	type: "input",
	name: "projectName",
	message: "What is your project named?",
	default: "my-web3-dapp",
	validate: (input) => {
		if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
		return "Project name may only include letters, numbers, underscores and hashes.";
	},
};
