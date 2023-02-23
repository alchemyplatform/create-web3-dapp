import { selfDestroy } from "./selfDestroy.js";
import { execSync } from "child_process";
import path from "path";
import fse from "fs-extra";
import { setUpHardhat } from "../backend_helpers/setupHardhat.js";
import { createEnv } from "../utils/createEnv.js";
import { cleanUpFiles } from "../utils/cleanUpFiles.js";
import BuilderContext from "../../interfaces/BuilderContext.js";
import { getDefaultRainbowkitChain } from "../utils/getDefaultRainbowkitChain.js";
import  {mkdir}  from "../utils/mkdir.js";

export const getProjectFiles = ({
	resolvedProjectPath,
	dappInfo,
}: BuilderContext) => {
	try {
		process.chdir(resolvedProjectPath);
		if (dappInfo.isTemplate) {
			switch (dappInfo.template) {
				case 0:
					execSync(
						`git clone --quiet ${"https://github.com/alchemyplatform/cw3d-nfts-gallery.git"} .`
					);
					break;
				case 1:
					execSync(
						`git clone --quiet ${"https://github.com/alchemyplatform/cw3d-donation-dapp"} .`
					);
					break;
				default:
					execSync(
						`git clone --quiet ${"https://github.com/alchemyplatform/cw3d-evm-boilerplate"} .`
					);
					break;
			}
		} else {
			execSync(
				`git clone --quiet ${"https://github.com/alchemyplatform/cw3d-evm-boilerplate"} .`
			);
		}

		if (!dappInfo.useBackend) {
			const frontend = path.join(process.cwd(), "frontend");

			fse.copySync(frontend, process.cwd());
			mkdir(path.join("pages", "api"));
		}
		if (dappInfo.useBackend) {
			mkdir(path.join("frontend", "pages", "api"));

			switch (dappInfo.backendProvider) {
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
				path.join(resolvedProjectPath, "backend"),
				false
			);
		}

		createEnv(
			{
				...dappInfo.apiKeys,
				ALCHEMY_NETWORK: dappInfo.chain,
				NEXT_PUBLIC_DEFAULT_CHAIN: getDefaultRainbowkitChain(
					dappInfo.isTestnet ? dappInfo.testnet! : dappInfo.chain
				),
			},
			dappInfo.useBackend
				? path.join(process.cwd(), "frontend")
				: process.cwd(),
			true
		);

		cleanUpFiles(dappInfo.useBackend);
	} catch (e) {
		selfDestroy(e);
	}
};
