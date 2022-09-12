import modulesToComponentDictionary from "./modulesToComponentDictionary.js";

export const getRoutesFromComponents = (components: string[]) => {
	const routes: string[] = [];
    
	for (const component of components) {
		if (modulesToComponentDictionary[component].routes?.length) {
			for (const route of modulesToComponentDictionary[component].routes!) {
				if (route && route.length && !routes.includes(route)) {
					routes.push(route);
				}
			}
		}
	}
	return routes;
};
