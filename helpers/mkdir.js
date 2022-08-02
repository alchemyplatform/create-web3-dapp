const fs = require('fs')
const getArgs = require('./getArgs')

const mkdir = (projectPath) => {
    fs.mkdirSync(projectPath, (err) => {
        if (err) {
            console.log("FOLDER ALREADY EXISTS:: ERRHANDLING")
            return
        }
    })
}

