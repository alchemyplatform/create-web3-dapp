#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */

import * as Commander from "commander";
import prompts from "prompts";
import path from "path";
import { createPackageJson } from "./helpers/createPackage.js";
import { existsSync, fstat } from "fs";
import { mkdir } from "./helpers/mkdir.js";
import { cleanUpFiles } from "./helpers/cleanUpFiles.js";
import { cloneRepo } from "./helpers/cloneRepo.js";
import { selfDestroy, setRoot } from "./helpers/selfDestroy.js";
import chalk from "chalk";
import { createEnv } from "./helpers/createEnv.js";
console.log(`MMMMMMMMMMMMMMMMMK:..:KMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMWO,    ,OWMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMWk'      'kWMMMMMMMMMMMMMM
MMMMMMMMMMMMMMK;        .dNMMMMMMMMMMMMM
MMMMMMMMMMMMMMWk'        .lXMMMMMMMMMMMM
MMMMMMMMMMMKdxNW0;        .cKMMMMMMMMMMM
MMMMMMMMMW0; .cXMK:.        ;0WMMMMMMMMM
MMMMMMMMWk'    :0WXl'.       ,kWMMMMMMMM
MMMMMMMNx.      ,0MNKd.       .xNMMMMMMM
MMMMMMNo.       'OMMMWx'       .oNMMMMMM
MMMMMXc.       ,OWMMMMWO;........dNMMMMM
MMMM0:        :0MMMMMMMMN0OO0OOO0XWMMMMM
MMWO,       .cXMXkxxxxxxxxxxxxxxxxxkKWMM
MWx'       .oNW0;.                  'xWM
Nd.       .xNWk'                     .dN
l.       'kWNx.                       .l
.       .kWM0'                         .`);
console.log("\n");
console.log("🔵 Welcome to the create-web3-dapp wizard 🔵");
console.log("\n");
let projectPath = "";

const program = new Commander.Command("create-web3-dapp")
  .version("0.1.0")
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
      while (!projectPath) {
        projectPath = await prompts({
          type: "text",
          name: "projectPath",
          message: "Please, insert a project name",
          initial: "my-dapp",
        }).then((data) => data.projectPath);
      }
    
    projectPath = projectPath.trim().replace(/[\W_]+/g, "-");
    console.log(projectPath)

    let resolvedProjectPath = path.resolve(projectPath);
    let dirExists = existsSync(resolvedProjectPath);
    setRoot(resolvedProjectPath);

    while (dirExists) {
      projectPath = await prompts({
        type: "text",
        name: "projectPath",
        message:
          "A directory with this name already exists, please use a different name",
        initial: "my-dapp",
      }).then((data) => data.projectPath);
      console.log(projectPath);
      resolvedProjectPath = path.resolve(projectPath);
      dirExists = existsSync(resolvedProjectPath);
      console.log(dirExists);
    }

    const projectName = path.basename(resolvedProjectPath);

    

    let dappInfo = {
      chain: null,
      isTestnet: false,
      testnet: null,
      useBackend: false,
      type: null,
      wantsTemplateFiles: false,
    };

    const chain = await prompts({
      type: "select",
      name: "chain",
      message: "For which VM are you building for?",
      choices: [
        { title: "Ethereum", value: "ethereum" },
        { title: "Polygon", value: "polygon" },
        { title: "Artbitrum", value: "arbitrum" },
        { title: "Optimism", value: "optimism" },
        { title: "Solana", value: "solana" },
      ],
      initial: 0,
    }).then((data) => data.chain);

    dappInfo.chain = chain;

    if (dappInfo.chain === "ethereum" || dappInfo.chain === "polygon") {
      const isTestnet = await prompts({
        type: "toggle",
        name: "testnet",
        message: "Do you want to use a testnet?",
        initial: true,
        active: "yes",
        inactive: "no",
      }).then((data) => data.testnet);
      dappInfo.isTestnet = isTestnet;

      if (isTestnet && dappInfo.chain === "ethereum") {
        const testnet = await prompts({
          type: "select",
          name: "chain",
          message: "Which testnet do you want to use?",
          choices: [
            { title: "Ethereum", value: "ethereum" },
            { title: "Polygon", value: "polygon" },
            { title: "Artbitrum", value: "arbitrum" },
            { title: "Optimism", value: "optimism" },
            { title: "Solana", value: "solana" },
          ],
          initial: 0,
        }).then((data) => data.chain);
        dappInfo.testnet = testnet
      }  
    }

    //TODO: Split in components selection

    const wantsTemplateFiles = await prompts({
      type: "toggle",
      name: "templateFiles",
      message: "Do you want to import the template files?",
      initial: true,
      active: "yes",
      inactive: "no",
    }).then((data) => data.templateFiles);

    dappInfo.wantsTemplateFiles = wantsTemplateFiles
 
    const useBackend = await prompts({
      type: "toggle",
      name: "useBackend",
      message: "Do you want to import a Blockchain development environment? (Hardhat, Foundry, Anchor",
      initial: true,
      active: "yes",
      inactive: "no",
    }).then((data) => data.useBackend);

    dappInfo.useBackend = useBackend;

    if (useBackend) {
      if (dappInfo.chain == "solana") {
        await prompts({
          type: "select",
          name: "backendType",
          message: "Choose a Blockchain development environment:",
          choices: [
            { title: "Anchor", value: "anchor" },
          ],
          initial: 0,
        }).then((data) => (dappInfo.type = data.backendType));
      } else {
        await prompts({
          type: "select",
          name: "backendType",
          message: "Choose a Blockchain development environment:",
          choices: [
            { title: "Hardhat", value: "hardhat" },
            { title: "Foundry", value: "foundry" },
          ],
          initial: 0,
        }).then((data) => (dappInfo.type = data.backendType));
      }
      }
    
    let alchemyAPIKey = await prompts({
      type: "text",
      name: "apiKey",
      message: "Insert your Alchemy API Key (if none, 'demo' will be used",
      initial: "demo",
    }).then((data) => data.apiKey);


    mkdir(resolvedProjectPath);

    cloneRepo(
      resolvedProjectPath,
      dappInfo
    );

    createPackageJson(projectName, dappInfo);

    createEnv(alchemyAPIKey);
    cleanUpFiles();

    console.log(
      chalk.green("Visit https://docs.alchemy.com/for the complete tutorial")
    );
  } catch (e) {
    selfDestroy(e);
  }
}

run();
