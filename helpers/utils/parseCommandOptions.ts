import context from "../core/context.js";
import { selfDestroy, setRoot } from "../core/selfDestroy.js";
import { validateProjectName } from "../utils/validation.js";
import path from "path";
import { SmartContractStandard } from "../smartContractsWizard/utils/smartContractStandards.js";
import { getTestnet } from "./getTestnet.js";
import {
	getTemplateSpecs,
	supportsTypescript,
} from "../templates_records/templatesDB.js";
import chalk from "chalk";
export const parseCommandOptions = (options) => {
	if (options.builderTemplate) {
		if (
			!getTemplateSpecs(options.builderTemplate) &&
			options.builderTemplate !== "new"
		) {
			selfDestroy(
				"No template with given name found. Check the docs to learn which templates are available\nADD LINK\n"
			);
		} else if (options.builderTemplate == "new") {
			context.dappInfo.template = "new";
			context.dappInfo.isTemplate = false;
		}
	}
	if (options.isTypescript) {
		if (!options.builderTemplate || options.builderTemplate == "new") {
			context.dappInfo.isTypescript = true;
		} else if (supportsTypescript(options.builderTemplate)) {
			context.dappInfo.isTypescript = true;
		} else {
			console.log(chalk.green("Template has no typescript, reverting to javascript version\n"))
		}
	}
	if (options.projectPath) {
		const isValidProjectName = validateProjectName(options.projectPath);
		if (typeof isValidProjectName == "boolean") {
			context.projectName = options.projectPath;
			context.resolvedProjectPath = path.resolve(options.projectPath);
			setRoot(context.resolvedProjectPath);
		} else {
			selfDestroy(`${isValidProjectName}`);
		}
	}

	if (options.chain) {
		const chains = [
			"ETH_MAINNET",
			"ETH_GOERLI",
			"MATIC_MAINNET",
			"MATIC_MUMBAI",
			"ARB_MAINNET",
			"ARB_GOERLI",
			"OPT_MAINNET",
			"OPT_GOERLI",
			"POLYGON_ZKEVM_MAINNET",
			"POLYGON_ZKEVM_TESTNET",
		];
		if (!chains.includes(options.chain)) {
			selfDestroy("Error: no chain exists with the specified name\n");
		} else {
			context.dappInfo.chain = options.chain;
			getTestnet();
		}
	}
	if (options.backend) {
		const backendProvider = options.backend.toLowerCase();
		if (backendProvider == "hardhat") {
			context.dappInfo.useBackend = true;
			context.dappInfo.backendProvider = backendProvider;
		} else {
			selfDestroy(
				"Error: no backend provider exists with the specified name\nCurrently supported backend provider: 'hardhat'\n"
			);
		}
	}
	if (
		options.contractStandard &&
		options.contractName &&
		options.contractLibraries
	) {
		//TODO: review
		const contractInfo = {
			name: options.contractName,
			symbol: options.contractName,
			standard: SmartContractStandard[options.smartContractStandard],
			isMintable: true,
			isBurnable: false,
			isPausable: false,
			isVotes: false,
			isFlashMint: false,
			isSnapshots: false,
			isOwnable: false,
			isRoles: false,
		};
		context.dappInfo.hasSmartContract = true;
		context.contractInfo = contractInfo;
	}
	if (options.apiKey?.length) {
		if (options.apiKey?.length == 32) {
			context.dappInfo.apiKeys.ALCHEMY_API_KEY = options.apiKey;
		} else {
			console.log("API KEY not formatted properly");
		}
	}
};
