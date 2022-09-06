
export const getModulesInCathegory = (toolkitType: string) => {
	return components[toolkitType];
};

export const selectModulesInCathegory = (toolkitType: string, modules: [string]) => {
	console.log(modules)
	for (const component of components[toolkitType]) {
		console.log(component.value)
		if (modules.includes(component.value)) {
			console.log(`Component selected ${component}`)
			component.selected = true;
		} else {
			console.log(`Component unselected ${component}`)
			component.selected = false;
		}
	}
}


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
			title: "NFT Minting panel",
			value: "nftMintingPanel",
		},
		{
			title: "NFT Transactions Box",
			value: "nftTransactionBox",
		},
		{
			title: "Collection Data Box",
			value: "collectionDataBox",
		},
		{
			title: "Collection Description Panel",
			value: "collectionDescriptionPanel",
		},
	],
	defi: [{}],
	governance: [{}],
};
