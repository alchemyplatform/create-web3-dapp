import modulesToComponentDictionary from "./modulesToComponentDictionary.js";

export const getHooksFromComponents = (components: string[]) => {
    const hooks: string[] = [];
    console.log("HOOKS", hooks)

    for (const component of components) {
        console.log(component)
		const hook = modulesToComponentDictionary[component].hooks;
		if (hook && hook.length && !hooks.includes(hook)) {
			hooks.push(hook);
		}
    }
    return hooks
};
