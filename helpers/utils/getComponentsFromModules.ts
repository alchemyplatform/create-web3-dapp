export const getComponentsFromModules = (modules: [string]) => {
    let components :string[] = [];
    console.log("getting components from modules")
    console.log(modules)
    for (const module of modules) {
        let moduleComponents = modulesToComponentDictionary[module].moduleComponents
        for (const moduleComponent of moduleComponents) {
            if (!components.includes(moduleComponent)) {
                components.push(moduleComponent)
            }
            if (!modules.includes(moduleComponent)) {
                modules.push(moduleComponent)
            }
        }
    }
    console.log("COMPONENTS:", components)
    return components
}

const modulesToComponentDictionary = {
	nftGallery: {
		moduleComponents: ["nftGallery", "nftCard"],
		hooks: [],
    },
    nftCard: {
        moduleComponents:["nftCard"]
    },
	nftDetailsPopUp: {
		moduleComponents: ["nftDetailsPopUp"],
		hooks: ["useComponentVisible"],
	},
};