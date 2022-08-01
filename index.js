#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */

import * as Commander from "commander"
import prompts from "prompts"


import path from "path"
import packageJson from "./package.json" assert {type: 'json'}
import {createPackageJson} from "./helpers/createPackage.js"
import { existsSync, fstat } from "fs"

let projectPath = ""

const program = new Commander.Command(packageJson.name)
    .version(packageJson.version)
    .arguments('[project-directory]')
    .usage("<project-directory>")
    .action(name => {
        projectPath = name
    })
    .option('--ts, --typescript', 'Initialize as a TypeScript project')
    .parse(process.argv)


async function run() {
    if (typeof projectPath === 'string') {
        projectPath = projectPath.trim()

    }

    if (!projectPath) {
        projectPath = await prompts({
            type: 'text',
            name: 'projectPath',
            message: 'Please add a project path',
            initial: 'my-dapp',
        }).then(data => data.projectPath)
        console.log(projectPath)
    }


    if (!projectPath) {
            //exit non 0
    }

    let resolvedProjectPath = path.resolve(projectPath);
    let dirExists = existsSync(resolvedProjectPath)
    
    while (dirExists) {
        projectPath = await prompts({
            type: 'text',
            name: 'projectPath',
            message: 'Please use a different project path',
            initial: 'my-dapp',
        }).then(data => data.projectPath)
        console.log(projectPath)
        resolvedProjectPath = path.resolve(projectPath);
        dirExists = existsSync(resolvedProjectPath)
        console.log(dirExists)
    }
    const projectName = path.basename(resolvedProjectPath);

    

    const isEthereumProject = await prompts({
        type: 'select',
        name: 'virtualMachine',
        message: 'For which VM are you building for?',
        choices: [
            { title: 'Solana', value: 'solana' },
            { title: 'Ethereum', value: 'ethereum' },
        ],
        initial: 1,
    }).then(data => data.virtualMachine)

    createPackageJson(isEthereumProject == "ethereum" ? true : false, resolvedProjectPath, projectName)
    
}

run()