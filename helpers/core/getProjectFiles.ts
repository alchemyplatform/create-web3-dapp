import { LogLevel, selfDestroy } from "./selfDestroy.js";
import { execSync } from "child_process";
import path from "path";
import fse from "fs-extra";
import { setUpHardhat } from "../backend_helpers/setupHardhat.js";
import { createEnv } from "../utils/createEnv.js";
import { cleanUpFiles } from "../utils/cleanUpFiles.js";
import BuilderContext from "../../interfaces/BuilderContext.js";
import { getDefaultRainbowkitChain } from "../utils/getDefaultRainbowkitChain.js";
import { mkdir } from "../utils/mkdir.js";
import fs, { existsSync } from "fs";
import { gitIgnoreTemplate } from "../utils/gitignore.template.js";
import {
	FileExtensions,
	getTemplateFiles,
} from "../templates_records/templatesDB.js";
export const getProjectFiles = ({
	resolvedProjectPath,
	dappInfo,
}: BuilderContext) => {
	try {
		if (!resolvedProjectPath || !dappInfo) return;
		process.chdir(resolvedProjectPath);
		if (dappInfo.isTemplate) {
			execSync(
				`git clone --quiet ${getTemplateFiles(
					dappInfo.template,
					dappInfo.isTypescript
						? FileExtensions.TYPESCRIPT
						: undefined
				)} .`
			);
		} else {
			if (dappInfo.isTypescript) {
				execSync(
					`git clone --quiet ${"https://github.com/Eversmile12/cw3d-evm-boilerplates-typescript"} .`
				);
			} else {
				execSync(
					`git clone --quiet ${"https://github.com/alchemyplatform/cw3d-evm-boilerplate"} .`
				);
			}
		}

		if (!dappInfo.useBackend) {
			const frontend = path.join(process.cwd(), "frontend");

			fse.copySync(frontend, process.cwd());

			// if (
			// 	!existsSync(path.join("pages", "api")) ||
			// 	!existsSync(path.join("frontend", "pages", "api"))
			// ) {
			// 	mkdir(path.join("pages", "api"));
			// }
			fs.writeFileSync(".gitignore", gitIgnoreTemplate);
		}
		if (dappInfo.useBackend) {
			// if (
			// 	!existsSync(path.join("pages", "api")) &&
			// 	!existsSync(path.join("frontend", "pages", "api"))
			// ) {
			// 	mkdir(path.join("frontend", "pages", "api"));
			// }

			fs.writeFileSync(
				path.join("frontend", ".gitignore"),
				gitIgnoreTemplate
			);

			switch (dappInfo.backendProvider) {
				case "hardhat-template":
				case "hardhat":
					setUpHardhat(dappInfo, resolvedProjectPath);
					break;
				case "foundry":
					break;
				default:
					break;
			}
			createEnv(
				{ ...dappInfo.apiKeys, ETHERSCAN_API_KEY: "", PRIVATE_KEY: "" },
				path.join(resolvedProjectPath!, "backend"),
				false
			);
			fs.writeFileSync(
				path.join("backend", ".gitignore"),
				gitIgnoreTemplate
			);
		}

		createEnv(
			{
				...dappInfo.apiKeys,
				ALCHEMY_NETWORK: dappInfo.testnet,
				NEXT_PUBLIC_ALCHEMY_NETWORK: dappInfo.testnet,
				NEXT_PUBLIC_DEFAULT_CHAIN: getDefaultRainbowkitChain(
					dappInfo.testnet
				),
			},
			dappInfo.useBackend
				? path.join(process.cwd(), "frontend")
				: process.cwd(),
			true
		);

		cleanUpFiles(dappInfo.useBackend);
	} catch (e) {
		selfDestroy(e, LogLevel.ERROR);
	}
};
