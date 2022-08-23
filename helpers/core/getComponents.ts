import chalk from "chalk";
import fse from "fs-extra";
import path from "path";

export const getComponents = (
	toolkitType: string,
	components: [string],
	isEVM: boolean
) => {
 

	for (const component of components) {
		const fromComponentPath = path.join(
			process.cwd(),
			"templates",
			isEVM ? "evm" : "solana",
			"components",
			toolkitType,
			component
		);
		const toComponentPath = path.join(process.cwd(), "pages", "components", component);
		fse.copySync(fromComponentPath, toComponentPath);
		const fromComponentStylePath = path.join(
			process.cwd(),
			"templates",
			isEVM ? "evm" : "solana",
			"components",
			toolkitType,
			`${component}.module.css`
		)
		const toComponentStylePath = path.join(process.cwd(), "styles", `${component}.module.css`);
		fse.copySync(fromComponentStylePath, toComponentStylePath);
	}
};
