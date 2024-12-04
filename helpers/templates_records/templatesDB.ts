import context from "../core/context.js";
import type { PromptObject } from "prompts";
import prompts from "prompts";
import open from "open";
import { DappInfo } from "../../interfaces/dappInfo.js";

export interface Template {
	id: string;
	hasTypescript: boolean;
	repository: string;
	useBackend?: boolean;
	backendProvider?: DappInfo["backendProvider"];
	typescriptRepository?: string;
	category: TemplateCategory;
	description: string;
	status: TemplateStatus;
	requirements?: {
		apiKeys?: string[];
		dependencies?: string[];
	};
	extraSteps?: Array<{ question: string; contextKey: string; open: string }>;
}

export enum TemplateStatus {
	ACTIVE = "active",
	BETA = "beta",
	DEVELOPMENT = "in_development"
}

export enum TemplateCategory {
	DEX = "DEX",
	NFT = "NFT",
	DEFI = "DeFi",
	DAO = "DAO",
	GAMEFI = "GameFi",
	SOCIAL = "Social",
	STARTER = "Starter"
}

export enum FileExtensions {
	"JAVASCRIPT" = "js",
	"TYPESCRIPT" = "ts",
}

const templates: Record<string, Template> = {
	"nft-explorer": {
		id: "nft-explorer",
		hasTypescript: true,
		repository: "https://github.com/alchemyplatform/cw3d-nft-explorer.git",
		category: TemplateCategory.NFT,
		description: "NFT Explorer with Alchemy NFT API integration",
		status: TemplateStatus.ACTIVE,
		requirements: {
			apiKeys: ["ALCHEMY_API_KEY"]
		}
	},
	"dex-uniswapv2": {
		id: "dex-uniswapv2",
		hasTypescript: true,
		repository: "coming-soon",
		useBackend: true,
		backendProvider: "foundry",
		category: TemplateCategory.DEX,
		description: "UniswapV2-style DEX with Foundry contracts",
		status: TemplateStatus.DEVELOPMENT
	},
	"nft-marketplace": {
		id: "nft-marketplace",
		hasTypescript: true,
		repository: "coming-soon",
		useBackend: true,
		backendProvider: "foundry",
		category: TemplateCategory.NFT,
		description: "Full-featured NFT marketplace",
		status: TemplateStatus.DEVELOPMENT
	},
	"dao-governance": {
		id: "dao-governance",
		hasTypescript: true,
		repository: "coming-soon",
		useBackend: true,
		backendProvider: "foundry",
		category: TemplateCategory.DAO,
		description: "DAO with token-based governance",
		status: TemplateStatus.DEVELOPMENT
	},
	"defi-lending": {
		id: "defi-lending",
		hasTypescript: true,
		repository: "coming-soon",
		useBackend: true,
		backendProvider: "foundry",
		category: TemplateCategory.DEFI,
		description: "Lending protocol with yield generation",
		status: TemplateStatus.DEVELOPMENT
	},
	"gamefi-starter": {
		id: "gamefi-starter",
		hasTypescript: true,
		repository: "coming-soon",
		useBackend: true,
		backendProvider: "foundry",
		category: TemplateCategory.GAMEFI,
		description: "GameFi starter with NFT integration",
		status: TemplateStatus.DEVELOPMENT
	}
} as const;

export const getTemplateSpecs = async (templateName: string): Promise<boolean> => {
	const template = templates[templateName];
	if (template) {
		if (template.status === TemplateStatus.DEVELOPMENT) {
			console.log(`⚠️  Note: The ${templateName} template is currently under development.`);
			return false;
		}

		if (template.useBackend) {
			context.dappInfo.useBackend = template.useBackend;
			context.dappInfo.backendProvider = template.backendProvider;
		}
		context.dappInfo.template = template.id;
		context.dappInfo.isTemplate = true;
		
		if (template.extraSteps) {
			for (const extraStep of template.extraSteps) {
				if (extraStep.open) {
					await open(extraStep.open);
				}
				const answer = await prompts({
					type: "text",
					name: "input",
					message: extraStep.question,
				});
				context.dappInfo.apiKeys[extraStep.contextKey] = answer.input;
			}
		}
		return true;
	}
	return false;
};

export const getTemplateFiles = (
	templateName: string,
	fileExtension: FileExtensions = FileExtensions.JAVASCRIPT
): string | false => {
	const template = templates[templateName];
	if (!template || template.status === TemplateStatus.DEVELOPMENT) {
		return false;
	}

	if (
		template.hasTypescript &&
		fileExtension === FileExtensions.TYPESCRIPT &&
		template.typescriptRepository
	) {
		return template.typescriptRepository;
	} else if (template.repository !== "coming-soon") {
		return template.repository;
	}
	return false;
};

export const supportsTypescript = (templateName: string): boolean => {
	return templates[templateName]?.hasTypescript ?? false;
};

export const getAvailableTemplates = (): Record<string, Template> => {
	return Object.entries(templates)
		.filter(([_, template]) => template.status === TemplateStatus.ACTIVE)
		.reduce((acc, [key, value]) => {
			acc[key] = value;
			return acc;
		}, {} as Record<string, Template>);
};
