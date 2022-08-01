import path from "path"
import fs from "fs"
import fse from "fs-extra"
import process from "process"
import { execSync } from "child_process"
import prompts from "prompts"


export const createPackageJson = async(
    isEthereumProject,
    projectPath,
    projectName

) => {
    try {
        
        fs.mkdirSync(projectPath, (err) => {
            if (err) {
                console.log("FOLDER ALREADY EXISTS:: ERRHANDLING")
                createPackageJson(isEthereumProject, null, null)
                return
            }
        })
        console.log("Downloading files...");
        process.chdir(projectPath)
        execSync(`git clone --depth 1 ${"https://github.com/Eversmile12/create-web3-dapp"} .`);

        let template = path.join(process.cwd(), "templates", "nextJS")
        fse.copySync(template, process.cwd())

        let packageJson = {
            "name": projectName,
            "version": "0.1.0",
            "private": true,
            "scripts": {
                "dev": "next dev",
                "build": "next build",
                "start": "next start",
                "lint": "next lint"
              },
              "dependencies": {
                "next": "12.2.3",
                "react": "18.2.0",
                "react-dom": "18.2.0"
              },
              "devDependencies": {
                "eslint": "8.20.0",
                "eslint-config-next": "12.2.3"
              }
        }

        if (isEthereumProject) {
            packageJson["dependencies"]["alchemy-sdk"] = "^2.0.0";
        }else {
            packageJson["dependencies"]["@project-serum/borsh"] = "^0.2.5";
            packageJson["dependencies"]["@solana/wallet-adapter-react-ui"] = "^0.9.11";
            packageJson["dependencies"]["@solana/wallet-adapter-wallets"] = "^0.17.0";
            packageJson["dependencies"]["@solana/web3.js"] = "^1.50.1";
        }
       
       
        
 
        fs.writeFileSync('package.json', JSON.stringify(packageJson, null, "\t"), err => { if (err) console.log(err) })
        execSync("npm install")
        execSync("npx next build")
        console.log("downloading dependencies")
        fs.rmSync(path.join(process.cwd(), "templates"), { recursive: true, force: true });
        fs.rmSync(path.join(process.cwd(), "helpers"), { recursive: true, force: true });
        

    } catch (e) {
       
    }
    
   
}

