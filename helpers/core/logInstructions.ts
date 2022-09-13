import chalk from "chalk";

export const logInstructions = (useBackend) => {
    console.log("\n\n\n")
    console.log("⚡️ Quick start:")
    let step = 1;
    console.log(
        `${step}. Create a new free account on ${chalk.blue(`https://alchemy.com`)}`
    );
    step++
    console.log(
        `${step}. Visit ${chalk.blue(`https://docs.alchemy.com/`)} for the documentation`
    );
    step++
    if (useBackend) {
        console.log(
            `${step}. Add your private key in the .env file inside the backend folder`
        );
        step++;
    }
    
    
    console.log(`${step}. ${chalk.green(`'cd' into your application ${useBackend ? "folder's frontend" : ""} directory and run 'npm run dev' to start it ⭐️`)}`)
}