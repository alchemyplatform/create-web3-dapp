import figlet from "figlet";
import chalk from "chalk";

const scaffoldText = figlet.textSync("scaffold\nalchemy", {
	font: "Standard",
	horizontalLayout: "default",
});

const colors = [chalk.cyan, chalk.blue, chalk.magenta];

const coloredScaffold = scaffoldText
	.split("\n")
	.map((line, i) => colors[i % colors.length](line))
	.join("\n");

export const logo = `
${coloredScaffold}

${chalk.green("create a web3 dapp with scaffold alchemy")}
`;
