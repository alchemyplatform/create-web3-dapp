#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */

import * as Commander from "commander"
import prompts from "prompts"


import path from "path"
import packageJson from "./package.json" assert {type: 'json'}
import {createPackageJson} from "./helpers/createPackage.js"

let projectPath = ""

const program = new Commander.Command(packageJson.name)
    .version(packageJson.version)
    .arguments('<project-directory>')
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
        //add prompts
    }


 if (!projectPath) {
        //exit non 0
 }

    const resolvedProjectPath = path.resolve(projectPath);
    const projectName = path.basename(resolvedProjectPath);

    const res = await prompts({
        type: 'text',
        name: 'virtualMachine',
        message: 'For which VM are you building for?',
        initial: 'ethereum or solana',
        choices: [
            { title: 'EVM', value: '#ff0000' },
            { title: 'Solana VM', value: '#00ff00' },
        ],
        validate: (virtualMachine) => {
            let normalizedVirtualMachine = virtualMachine.toLowerCase()
            if (normalizedVirtualMachine === 'solana' || normalizedVirtualMachine === 'sol' || normalizedVirtualMachine === 'ethereum' || normalizedVirtualMachine === 'eth') {
                return true
            } else {
                return "Please write solana or ethereum (sol or eth)"
            }
        }
    })

    createPackageJson(true, projectPath, projectName)
    
}

run()