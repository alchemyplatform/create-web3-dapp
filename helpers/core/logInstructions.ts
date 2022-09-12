import chalk from "chalk";

export const logInstructions = () => {
    console.log("\n\n\n")
    console.log("⚡️ Quick start:")
    console.log(
        `1. Create a new free account on ${chalk.blue(`https://alchemy.com`)}`
    );
    console.log(
        `2. Visit ${chalk.blue(`https://docs.alchemy.com/`)} for the complete tutorial`
    );

    console.log(`3. ${chalk.green("Cd into your application folder and run 'npm run dev to' start it ⭐️")}`)
}