import chalk from "chalk";
import ora from "ora";
import figlet from "figlet";

export async function printOutroMessage(projectName) {
	// Create a loading spinner
	const spinner = ora("Creating magic...").start();

	// Simulate some loading time
	await new Promise((resolve) => setTimeout(resolve, 1500));
	spinner.succeed("Project created successfully!");

	// Create ASCII art with rainbow effect
	const text = figlet.textSync("Congrats!", {
		font: "Standard",
		horizontalLayout: "full",
	});

	const colors = [
		chalk.red,
		chalk.yellow,
		chalk.green,
		chalk.cyan,
		chalk.blue,
		chalk.magenta,
	];

	const rainbowText = text
		.split("\n")
		.map((line, i) => colors[i % colors.length](line))
		.join("\n");

	console.log("\n" + rainbowText);

	const message = `
    ${chalk.bold.green("🎉 Your Web3 dapp is ready to rock! 🚀")}

    ${chalk.bold("Next steps:")}

    ${chalk.dim("1.")} ${chalk.bold("Follow the alchemy account setup")} 📖
       go to https://docs.alchemy.com/docs/scaffold-alchemy/account-setup

    ${chalk.dim("2.")} ${chalk.bold("Navigate to your project")} 🏃
       cd ${projectName}

    ${chalk.dim("3.")} ${chalk.bold("Install dependencies")} 📦
       yarn

    ${chalk.dim("4.")} ${chalk.bold(
		"In a new terminal, deploy your contracts"
	)} 📄
       yarn deploy

    ${chalk.dim("5.")} ${chalk.bold("Start the frontend")} 🌟
       yarn dev

    ${chalk.bold.green(
		"Thanks for using Scaffold Alchemy! Let's build something amazing! 🙏 ✨"
	)}
    ${chalk.blue(
		"Visit https://docs.alchemy.com/docs/scaffold-alchemy to learn more"
	)}
    `;

	console.log(message);
}
