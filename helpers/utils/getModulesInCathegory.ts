import { modulesList } from "./modulesList.js";

export const getModulesInCathegory = (toolkitType: string) => {
	return modulesList[toolkitType];
};

export const selectModulesInCathegory = (
	componentCathegory: string,
	modulesList: string[]
) => {
	
		for (const component of modulesList[componentCathegory]) {
			if (modulesList.includes(component.value)) {
				component.selected = true;
			} else {
				component.selected = false;
			}
		}
	};

export const getSelectedModules = () => {
	const selectedModules: string[] = [];
	for (const [key, value] of Object.entries(modulesList)) {
		for (const module of value) {
			if (module.selected) {
				selectedModules.push(module.value);
			}
		}
	}
	return selectedModules;
};

