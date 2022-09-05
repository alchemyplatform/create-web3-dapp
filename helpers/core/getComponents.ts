import fse from "fs-extra";
import path from "path";
import {getComponentsFromModules} from "../utils/getComponentsFromModules.js"
export const getComponents = (
	toolkitType: string,
	modules: [string],
	isEVM: boolean,
	useBackend: boolean
) => {
	
	const components = getComponentsFromModules(modules)
	
	for (const component of components) {
		const fromComponentPath = path.join(
			process.cwd(),
			"templates",
			isEVM ? "evm" : "solana",
			"components",
			toolkitType,
			`${component + ".jsx"}`
		);

		let toComponentPath = "";
		if (useBackend) {
			toComponentPath = path.join(process.cwd(), "frontend", "pages", "components", `${component + ".jsx"}`);
		} else {
			toComponentPath = path.join(process.cwd(), "pages", "components", `${component + ".jsx"}`);
		}
		fse.copySync(fromComponentPath, toComponentPath);

		const fromComponentStylePath = path.join(
			process.cwd(),
			"templates",
			isEVM ? "evm" : "solana",
			"components",
			toolkitType,
			`${component.charAt(0).toUpperCase() + component.slice(1)}.module.css`
		)
		let toComponentStylePath = "";
		if (useBackend) {
			toComponentStylePath = path.join(process.cwd(),"frontend", "styles", `${component.charAt(0).toUpperCase() + component.slice(1)}.module.css`);
		} else {
			toComponentStylePath = path.join(process.cwd(), "styles", `${component.charAt(0).toUpperCase() + component.slice(1)}.module.css`);
		}
		fse.copySync(fromComponentStylePath, toComponentStylePath);
	}
};
