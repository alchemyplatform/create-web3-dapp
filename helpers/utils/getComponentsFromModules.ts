import modulesToComponentDictionary from "./modulesToComponentDictionary.js"
import { Module } from "../../interfaces/Module"

export const getComponentsFromModules = (modules: string[]) => {
    const components : string[] = [];
    
    for (const module of modules) {
        const moduleComponents = modulesToComponentDictionary[module].moduleComponents
        for (const moduleComponent of moduleComponents) {
            if (!components.includes(moduleComponent)) {
                components.push(moduleComponent)
            }
            
            if (!modules.includes(moduleComponent)) {
                modules.push(moduleComponent)
            }
        }
    }
    return components
}

