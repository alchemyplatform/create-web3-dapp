import fse from "fs-extra";
import path from "path";
import { Component } from "../../interfaces/component";

export const getComponents = (
	toolkitType: string,
	components: [Component],
	chain: string
) => {
	for (const component of components) {
		const fromComponentPath = path.join(
			process.cwd(),
			"templates",
			chain == "solana" ? "evm" : "solana",
			"components",
			toolkitType,
			component.name
		);
		const toComponentPath = path.join(process.cwd(), "components");
		fse.copySync(fromComponentPath, toComponentPath);
	}
};
