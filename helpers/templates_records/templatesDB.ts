import context from "../core/context.js";
import prompts from "prompts";
import open from "open";

export interface Template {
	id: string;
	hasTypescript: boolean;
	repository: string;
	useBackend?: boolean;
	backendProvider?: string;
	typescriptRepository?: string;
	extraSteps?: Array<{ question: string; contextKey: string; open: string }>;
}

export enum FileExtensions {
	"JAVASCRIPT" = "js",
	"TYPESCRIPT" = "ts",
}
const templates: { [key: string]: Template } = {
	"nft-explorer": {
		id: "nft-explorer",
		hasTypescript: false,
		repository: "https://github.com/alchemyplatform/cw3d-nft-explorer.git",
		// extraSteps: [
		// 	{
		// 		question: "Enter the API key for the template",
		// 		contextKey: "NFT-Explorer",
		// 		open: "https://alchemy.com",
		// 	},
		// ],
	},
};

export const getTemplateSpecs = async (templateName: string) => {
	const template = templates[templateName];
	if (template) {
		if (template.useBackend) {
			context.dappInfo.useBackend = template.useBackend;
			context.dappInfo.backendProvider = template.backendProvider;
		}
		context.dappInfo.template = template.id;
		context.dappInfo.isTemplate = true;
		if (template.extraSteps) {
			for (const extraStep of template.extraSteps) {
				if (extraStep.open) {
					open(extraStep.open);
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
) => {
	if (
		supportsTypescript(templateName) &&
		fileExtension == FileExtensions.TYPESCRIPT
	) {
		return templates[templateName].typescriptRepository;
	} else if (templates[templateName]) {
		return templates[templateName].repository;
	} else {
		return false;
	}
};

export const supportsTypescript = (templateName: string) => {
	if (templates[templateName]) {
		return templates[templateName].hasTypescript;
	}
	return false;
};
