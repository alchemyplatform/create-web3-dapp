import chalk from "chalk";
import { DappInfo } from "../../interfaces/DappInfo";

export const logInstructions = (dappInfo: DappInfo, projectPath:string) => {
    console.log("\n\n\n")
    console.log("⚡️ Quick start:")
    let step = 1;
    console.log(
        `${step}. Create a new free account on ${chalk.blue(`https://alchemy.com/?a=create-web3-dapp`)}`
    );
    step++
    console.log(
        `${step}. Visit ${chalk.blue(`https://docs.alchemy.com/?a=create-web3-dapp`)} for the documentation`
    );
    step++
    if (dappInfo.useBackend) {
        console.log(
            `${step}. Add your private key in the .env file inside the backend folder`
        );
        step++;
    }
    
    
    console.log(`${step}. ${chalk.green(`'cd' into ${dappInfo.useBackend ? `${projectPath}/frontend`:`${projectPath}`} and run 'npm run dev' to start it ⭐️`)}`)
}