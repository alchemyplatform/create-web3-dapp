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
	}
};
