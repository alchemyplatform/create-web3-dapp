#!/usr/bin/env node

import * as Commander from "commander";
import prompts from "prompts";
import path from "path";
import { createPackageJson } from "./helpers/utils/createPackage.js";
import { existsSync } from "fs";
import { mkdir } from "./helpers/utils/mkdir.js";
import { cleanUpFiles } from "./helpers/utils/cleanUpFiles.js";
import { cloneRepo } from "./helpers/utils/cloneRepo.js";
import { selfDestroy, setRoot } from "./helpers/utils/selfDestroy.js";
import chalk from "chalk";
import { createEnv } from "./helpers/utils/createEnv.js";
import { dappInfo } from "./interfaces/dappInfo.js";

console.log(`
MMMMMMMMMMMMMMMMMK:..:KMMMMMMMMMMMMMMMMM
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
.       .kWM0'                         .
`);

console.log("\n");
console.log("🔵 Welcome to the create-web3-dapp wizard 🔵");
console.log("\n");

let projectPath = "";

// Gets project name
const program = new Commander.Command("create-web3-dapp")
  .version("0.1.0")
  .arguments("[project-directory]")
  .usage("<project-directory>")
  .action((name: string) => {
    projectPath = name;
  })
  .option("--ts, --typescript", "Initialize as a TypeScript project")
  .parse(process.argv);

// Starts creation process
async function run() {
  try {
    // Checks if project name is provided
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

    //Reformat project's name
    projectPath = projectPath.trim().replace(/[\W_]+/g, "-");

    let resolvedProjectPath: string = path.resolve(projectPath);
    let dirExists: boolean = existsSync(resolvedProjectPath);
    setRoot(resolvedProjectPath);

    // Check if project
    while (dirExists) {
      projectPath = await prompts({
        type: "text",
        name: "projectPath",
        message:
          "A directory with this name already exists, please use a different name",
        initial: "my-dapp",
      }).then((data) => data.projectPath.trim().replace(/[\W_]+/g, "-"));
      resolvedProjectPath = path.resolve(projectPath);
      dirExists = existsSync(resolvedProjectPath);
    }

    const projectName = path.basename(resolvedProjectPath);

    const dappInfo: dappInfo = {
      chain: "",
      isEVM: true,
      isTestnet: false,
      useBackend: false,
      backendProvider: "",
      wantsTemplateFiles: false,
      apiKeys: {},
    };

    const chain: string = await prompts({
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

    dappInfo.isEVM =
      chain == "ethereum" ||
      chain == "polygon" ||
      chain == "arbitrum" ||
      chain == "optimism"
        ? true
        : false;

    if (dappInfo.chain === "ethereum" || dappInfo.chain === "polygon") {
      const isTestnet: boolean = await prompts({
        type: "toggle",
        name: "testnet",
        message: "Do you want to use a testnet?",
        initial: true,
        active: "yes",
        inactive: "no",
      }).then((data) => data.testnet);
      dappInfo.isTestnet = isTestnet;

      if (isTestnet) {
        switch (chain) {
          case "ethereum":
            dappInfo.testnet = "goerli";
            break;
          case "polygon":
            dappInfo.testnet = "mumbai";
        }
      }
    }
    //TODO: Split in components selection

    const wantsTemplateFiles: boolean = await prompts({
      type: "toggle",
      name: "templateFiles",
      message: "Do you want to import the template files?",
      initial: true,
      active: "yes",
      inactive: "no",
    }).then((data) => data.templateFiles);

    dappInfo.wantsTemplateFiles = wantsTemplateFiles;

    const useBackend: boolean = await prompts({
      type: "toggle",
      name: "useBackend",
      message:
        "Do you want to import a Blockchain development environment? (Hardhat, Foundry, Anchor",
      initial: true,
      active: "yes",
      inactive: "no",
    }).then((data) => data.useBackend);

    dappInfo.useBackend = useBackend;

    if (useBackend) {
      // set provider
      if (dappInfo.chain === "solana") {
        await prompts({
          type: "select",
          name: "provider",
          message: "Choose a Blockchain development environment:",
          choices: [{ title: "Anchor", value: "anchor" }],
          initial: 0,
        }).then((data) => (dappInfo.backendProvider = data.provider));
      } else {
        await prompts({
          type: "select",
          name: "backendType",
          message: "Choose a Blockchain development environment:",
          choices: [
            { title: "Hardhat", value: "hardhat" },
            { title: "Foundry (not yet supported)", value: "foundry" },
          ],
          initial: 0,
        }).then((data) => (dappInfo.backendProvider = data.backendType));
      }
    }

    const alchemyAPIKey: string = await prompts({
      type: "text",
      name: "apiKey",
      message: "Insert your Alchemy API Key (if none, 'demo' will be used",
      initial: "demo",
    }).then((data) => data.apiKey);

    dappInfo.apiKeys["alchemy_api_key"] = alchemyAPIKey;
    dappInfo.apiKeys["private_key"] = "none";

    mkdir(resolvedProjectPath);
    cloneRepo(resolvedProjectPath, dappInfo);
    createPackageJson(projectName, dappInfo);
    createEnv(dappInfo.apiKeys, process.cwd());
    cleanUpFiles();

    console.log(
      chalk.green("Visit https://docs.alchemy.com/ for the complete tutorial")
    );
  } catch (e) {
    selfDestroy();
  }
}

run();
