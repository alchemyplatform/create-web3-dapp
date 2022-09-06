import modulesToComponentDictionary from "./modulesToComponentDictionary.js";

export const getHooksFromComponents = (components: string[]) => {
    const hooks: string[] = [];

    for (const component of components) {
		const hook = modulesToComponentDictionary[component].hooks;
		if (hook && hook.length && !hooks.includes(hook)) {
			hooks.push(hook);
		}
    }
    return hooks
};
