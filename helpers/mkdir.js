const fs = require('fs')
const getArgs = require('./getArgs')

const mkdir = () => {
    const projectInfo = getArgs()
    try {
        fs.mkdirSync(projectInfo.projectName)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

