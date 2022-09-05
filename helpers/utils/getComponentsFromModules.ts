import modulesToComponentDictionary from "./modulesToComponentDictionary.js"

export const getComponentsFromModules = (modules: [string]) => {
    let components :string[] = [];
    
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

