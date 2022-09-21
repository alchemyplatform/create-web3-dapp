export const getModulesInCathegory = (toolkitType: string) => {
	return components[toolkitType];
};

export const selectModulesInCathegory = (
	toolkitType: string,
	modules: [string]
) => {
	for (const component of components[toolkitType]) {
		if (modules.includes(component.value)) {
			component.selected = true;
		} else {
			component.selected = false;
		}
	}
};

const components = {
	nfts: [
		{
			title: "NFTs Gallery",
			value: "nftGallery",
		},
		{
			title: "NFT Details PopUp",
			value: "nftDetailsPopUp",
		},
		{
			title: "Snapshot Box",
			value: "snapshotBox",
		},
	],
	utils: [
		{
			title: "Smart Contracts Tester",
			value: "smartContractPlayground",
		},
	],
	defi: [{}],
	governance: [{}],
};
