import fs from "fs"

export const mkdir = (projectPath: string) => {
    try {
        fs.mkdirSync(projectPath)
    } catch (e: any) {
      console.log(e)
    }
}

