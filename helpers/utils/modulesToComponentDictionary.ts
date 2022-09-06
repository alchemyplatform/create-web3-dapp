const modulesToComponentDictionary = {
	nftGallery: {
		moduleComponents: ["nftGallery", "nftCard"],
		hooks: [],
    },
    nftCard: {
        moduleComponents:["nftCard", "primaryButton"]
    },
	nftDetailsPopUp: {
		moduleComponents: ["nftDetailsPopUp", "primaryButton"],
		hooks: ["useComponentVisible"],
	},
	primaryButton: {
		moduleComponents: ["primaryButton"],
	},
	snapshotBox: {
		moduleComponents: ["snapshotBox", "primaryButton"],
		
	},
};
export default modulesToComponentDictionary