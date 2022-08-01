const { execSync } = require("child_process");

const popular = async () => {
    const {gitRepo, projectPath} = getArgs()
    try{
        console.log("Download files...");
        execSync(`git clone --depth 1 ${gitRepo} ${projectPath}`);

        process.chdir(projectPath)

        execSync("npm install")
    } catch (err) {
        console.log(err)
    }
}