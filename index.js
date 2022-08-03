#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */

import * as Commander from "commander";
import prompts from "prompts";
import path from "path";
import packageJson from "./package.json" assert { type: "json" };
import { createPackageJson } from "./helpers/createPackage.js";
import { existsSync } from "fs";
import { mkdir } from "./helpers/mkdir.js";
import { cleanUpFiles } from "./helpers/cleanUpFiles.js";
import { cloneRepo } from "./helpers/cloneRepo.js";
import {selfDestroy, setRoot} from "./helpers/selfDestroy.js"
import chalk from "chalk";
let projectPath = "";

const program = new Commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments("[project-directory]")
  .usage("<project-directory>")
  .action((name) => {
    projectPath = name;
  })
  .option("--ts, --typescript", "Initialize as a TypeScript project")
  .parse(process.argv);

async function run() {
    try {
        if (typeof projectPath === "string") {
            projectPath = projectPath.trim();
        }

        if (!projectPath) {
            projectPath = await prompts({
                type: "text",
                name: "projectPath",
                message: "Please add a project path",
                initial: "my-dapp",
            }).then((data) => data.projectPath);
            console.log(projectPath);
        }

        if (!projectPath) {
            //exit non 0
        }

        let resolvedProjectPath = path.resolve(projectPath);
        let dirExists = existsSync(resolvedProjectPath);
        setRoot(resolvedProjectPath)
        while (dirExists) {
            projectPath = await prompts({
                type: "text",
                name: "projectPath",
                message: "Please use a different project path",
                initial: "my-dapp",
            }).then((data) => data.projectPath);
            console.log(projectPath);
            resolvedProjectPath = path.resolve(projectPath);
            dirExists = existsSync(resolvedProjectPath);
            console.log(dirExists);
        }
        const projectName = path.basename(resolvedProjectPath);

        const isEthereumProject = await prompts({
            type: "select",
            name: "virtualMachine",
            message: "For which VM are you building for?",
            choices: [
                { title: "Ethereum", value: "ethereum" },
                { title: "Solana", value: "solana" },
            ],
            initial: 0,
        }).then((data) => data.virtualMachine == "ethereum" ? true : false);

        const wantsTemplateFiles = await prompts({
            type: "toggle",
            name: "templateFiles",
            message: "Do you want to import the tutorial?",
            initial: true,
            active: "yes",
            inactive: "no",
        }).then((data) => (data.templateFiles));


        let backendInfo = {};

        const wantsBackend = await prompts({
            type: "toggle",
            name: "backend",
            message: "Do you want to add a backend?",
            initial: true,
            active: "yes",
            inactive: "no",
        }).then((data) => (data.backend));

        backendInfo["wantsBackend"] = wantsBackend



        
        if (isEthereumProject) {
            await prompts({
                type: "select",
                name: "ethereumBackend",
                message: "For which VM are you building for?",
                choices: [
                    { title: "Hardhat", value: "hardhat" },
                    { title: "Foundry", value: "foundry" },
                ],
                initial: 0,
            }).then((data) => backendInfo["type"] = data.ethereumBackend );
            
        }
      
        console.log(backendInfo)

        // console.log("wantsTemplate", wantsTemplateFiles);

        mkdir(resolvedProjectPath);
        cloneRepo(resolvedProjectPath, isEthereumProject, wantsTemplateFiles, backendInfo);
        console.log(chalk.green("files copied ✅"))
        createPackageJson(
            isEthereumProject,
            projectName,
            wantsBackend,
            isHardhatBackend
        );
        cleanUpFiles();

        console.log(chalk.green("Visit alchemy.com/docs for the complete tutorial"))
    } catch (e) {
        selfDestroy(e)
    }
}

run();
