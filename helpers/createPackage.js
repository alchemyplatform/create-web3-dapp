import path from "path"
import fs from "fs"
import fse from "fs-extra"
import process from "process"

export const createPackageJson = (
    name,
    solana,
    projectPath,
    projectName

) => {
    try {
        fs.mkdir(projectPath, (err)=>{if(err)console.log(err)})
        let template = path.join(process.cwd(), "templates", "nextJS")
        console.log(template)
        fse.copySync(template, projectPath)
    } catch (e) {
        console.log(e)
    }
    
   
}

