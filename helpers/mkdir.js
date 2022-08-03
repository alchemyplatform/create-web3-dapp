import fs from "fs"

export const mkdir = (projectPath) => {
    fs.mkdirSync(projectPath, (err) => {
        if (err) {
            console.log("FOLDER ALREADY EXISTS:: ERRHANDLING")
            return
        }
    })
}

